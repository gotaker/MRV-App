import { MenuModel } from './../model/common/menu-model';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { SnackbarDialogComponent } from '../modal/snackbar-dialog/snackbar-dialog.component';
import { CementProductionService } from './cement-production.service';
import { SectorDetailsRequest } from '../model/common/sector-details-request';
import { UtilityServiceService } from '../../utility-service.service';
import { MrvConstants } from '../../mrv-constant';

@Component({
  selector: 'app-cement-production',
  templateUrl: './cement-production.component.html',
  styleUrls: ['./cement-production.component.scss']
})
export class CementProductionComponent implements OnInit {
  
  // sector details
  sectorArr:string[] = [];
  categoryArr:string[] = [];
  subSectorArr:string[] = [];
  
  formGroup: FormGroup;
  yearList: any;

  dataList: any = [];
  newlyAddedList: any = [];
  clickerData: any = {
    clinkerImport : 0,
    clinkerExport :0,
    reference : ''
  }

  routeFormId: string;
  routeRecordId: string;
  approvalScreen: boolean;

  // Table related declarations
  //table related declarations
  true: boolean = true;
  displayedColumns = [];

  dataSource = new MatTableDataSource(this.dataList);
  newDataSource = new MatTableDataSource(this.newlyAddedList);


  cementTypeCtrl = new FormControl();
  amountProducedCtrl = new FormControl();
  clinkerFractionCtrl = new FormControl();
  referenceCtrl = new FormControl();

  public selection = new SelectionModel<any>(true, []);
  public newSelection = new SelectionModel<any>(true, []);

  columnNames = [
    { id: "cementType", value: "Cement Type", formControl: this.cementTypeCtrl },
    { id: "amountProduced", value: "Amount of Cement produced", formControl: this.amountProducedCtrl },
    { id: "clinkerFraction", value: "Clinker Fraction in Cement(%)", formControl: this.clinkerFractionCtrl },
    { id: "reference", value: "Reference", formControl: this.referenceCtrl }
  ];

  filteredValues = {
    cementType: '', amountProduced: '', clinkerFraction: '', reference: ''
  };

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  remarksCtrl = new FormControl('',[Validators.required]);
  approverCommentCtrl = new FormControl();

  constructor(private readonly _fb: FormBuilder,
    private readonly _ts: CementProductionService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router,
    private utilityService:UtilityServiceService,
    private readonly appService: AppService) {
      this.dataList = [];
      this.newlyAddedList = [];

    this.dataSource.data = this.dataList;
    this.newDataSource.data = this.newlyAddedList;
  }
  

  loadActivityData(type, value){
    var obj: any = {
      menuId : this.formGroup.controls.menuId.value,
      [type] : value
    }
    this.dataList = [];
    this.dataSource.data = this.dataList;
    this.appService.getDataRecord(obj).subscribe((res: any)=>{
      if (res.statusCode == 200 && res.data ) {
        if (type != "_id" && res.data.length) { 
          this.setFormValue(res.data[0]);
          // this.remarksCtrl.setValue(res.data[0].remark);
          
        } else {
          this.setFormValue(res.data);
        }
      } else {
        this.utilityService.openSnackBar(MrvConstants.ERROR_NO_DATA, MrvConstants.LOG_WARN);
      }
    }, err => {
      this.utilityService.openSnackBar(err.message, MrvConstants.LOG_ERROR);
    });
  }
  setFormValue(data: any) {
    // set form values as per object heirarchy
    this.formGroup.patchValue(data);
    // set other values mannually
    this.dataList = data.cementData;
    this.dataSource.data = this.dataList;
    this.clickerData = data.clinkerData.length ? data.clinkerData[0] : null;
  }
  ngOnInit() {
    this.yearList = [];
    this.dataList = [];
    this.newlyAddedList = [];
    // create form 
    this.buildForm();
    // reading details from routeParams
    this.getBasicDataFromRoute();

    this.getYears();

    this.displayedColumns = this.columnNames.map(x => x.id);
    if(!this.approvalScreen){
      this.displayedColumns.push('actions');
      this.displayedColumns.unshift('select');
    }

    // this.dataSource = new MatTableDataSource(this.dataList);
    this.dataSource.paginator = this.paginator;

    this.newDataSource = new MatTableDataSource(this.newlyAddedList);
    this.dataSource.filterPredicate = this.customFilterPredicate();

    this.checkForApprovalPage();
  }
  private checkForApprovalPage() {
    this.approvalScreen = false;
    this.routeFormId = this._activatedRoute.snapshot.paramMap.get('formId');
    this.routeRecordId = this._activatedRoute.snapshot.paramMap.get('recordId');
    if (this.routeFormId) {
      this.approvalScreen = true;
      this.loadActivityData('_id', this.routeFormId);
    }
  }

  private buildForm() {
    this.formGroup = this._fb.group({
      menuId: [null, [Validators.required]],
      inventoryYear: [null, [Validators.required]],
      sector: ['', [Validators.required]],
      subSector: ['', [Validators.required]],
      category: ['', [Validators.required]],
      calculationApproach: ['', [Validators.required]],
      remark: this.remarksCtrl
    });
  }
  private getBasicDataFromRoute() {
    this._activatedRoute.data.subscribe(routeData => {
      this.formGroup.controls.menuId.patchValue(routeData.menuId);
      let payload: SectorDetailsRequest = {
        menuId: routeData.menuId,
        subSector: routeData.subSector
      }
      this.utilityService.sectorDetailsForGHGByMenu(payload,(response)=>{
        this.sectorArr = response.sectorArr;
        this.categoryArr = response.categoryArr;
        this.subSectorArr = response.subSectorArr;
        this.populateSectorDetails();
      });
    });
  }
  populateSectorDetails() {
    this.formGroup.controls.sector.patchValue(this.sectorArr.length ? this.sectorArr[0] : "");
    this.formGroup.controls.category.patchValue(this.categoryArr.length ? this.categoryArr[0] : "");
    this.formGroup.controls.subSector.patchValue(this.subSectorArr.length ?this.subSectorArr[0] : "");
  }
  getYears() {
    this._ts.getInventoryYears().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.yearList = res.data;
      }
    }, err => {
    })
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  applyFilter(filterValue: string) {
    let filter = {
      cementType: filterValue.trim().toLowerCase(),
      amountProduced: filterValue.trim().toLowerCase(),
      clinkerFraction: filterValue.trim().toLowerCase(),
      reference: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter)
  }

  public customFilterPredicate() {
    const myFilterPredicate = function (data: any, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let cementType = data.cementType.toString().trim().toLowerCase().indexOf(searchString.cementType.toLowerCase()) !== -1
      let amountProduced = data.amountProduced.toString().trim().toLowerCase().indexOf(searchString.amountProduced.toLowerCase()) !== -1
      let clinkerFraction = data.clinkerFraction.toString().trim().toLowerCase().indexOf(searchString.clinkerFraction.toLowerCase()) !== -1
     let reference = data.reference.toString().trim().toLowerCase().indexOf(searchString.reference.toLowerCase()) !== -1
      if (searchString.topFilter) {
        return cementType || amountProduced || clinkerFraction  || reference
      } else {
        return cementType && amountProduced && clinkerFraction && reference
      }
    }
    return myFilterPredicate;

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllNewSelected() {
    const numSelected = this.newSelection.selected.length;
    const numRows = this.newDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  masterToggleNew() {
    this.isAllNewSelected() ?
      this.newSelection.clear() :
      this.newDataSource.data.forEach(row => this.newSelection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  checkboxLabelNew(row?: any): string {
    if (!row) {
      return `${this.isAllNewSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.newSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  addNewRow() {
    let x = this.newlyAddedList.length;
    this.newlyAddedList.push({
      cementType: '', amountProduced: 0, clinkerFraction: 0.75,reference: '', 
    });
    this.newDataSource.data = this.newlyAddedList
  }

  removeIndividuallyFromList(list, ele){
    if(list == 'exist'){
      this.dataList.splice(ele, 1);
      this.dataSource.data = this.dataList;
    }
    if(list == 'new'){
      this.newlyAddedList.splice(ele, 1);
      this.newDataSource.data = this.newlyAddedList;
    } 
  }
  removeSelected(list){
    if(list == 'exist'){
      let y = new Set(this.selection.selected);
      this.dataList = this.dataList.filter( x => !y.has(x) );
      this.dataSource.data = this.dataList;
    }
    if(list == 'new'){
      let y = new Set(this.newSelection.selected);
      this.newlyAddedList = this.newlyAddedList.filter( x => !y.has(x) );
      this.newDataSource.data = this.newlyAddedList;
    }
    
  }

  saveElectricityGeneration() {
    // console.log(this.dataList);
    // console.log(this.newlyAddedList);
    if(this.formGroup.status == "INVALID") {
      this.formGroup.markAllAsTouched();
      this.utilityService.openSnackBar(MrvConstants.ERROR_ENTER_REQUIRED,MrvConstants.LOG_ERROR);
      return;
    }
    var obj = {
      inventoryYear: this.formGroup.controls['inventoryYear'].value,
      sector: this.formGroup.controls['sector'].value,
      subSector: this.formGroup.controls['subSector'].value,
      category: this.formGroup.controls['category'].value,
      calculationApproach: this.formGroup.controls['calculationApproach'].value,
      cementData: this.dataList.concat(this.newlyAddedList),
      clinkerData : this.clickerData,
      updatedBy: JSON.parse(localStorage.getItem('loggedInUser'))._id,
      remark: this.formGroup.controls.remark.value,
      menuId : this.formGroup.controls.menuId.value,
    };

    this.appService.saveRecord(obj).subscribe((res: any) => {
      if(res.statusCode == 200){
        this.utilityService.openSnackBar(res.message,  MrvConstants.LOG_SUCCESS);
        this.formGroup.reset();
        this.dataList = [];
        this.dataSource.data = this.dataList;
        this.newlyAddedList = [];
        this.newDataSource.data = this.newlyAddedList;
        this.clickerData = {
          clinkerImport: '',
          clinkerExport: '',
          reference: ''
        }
      }
      else{
        this.utilityService.openSnackBar(res.message,  MrvConstants.LOG_ERROR);
      }
    }, err => {
      this.utilityService.openSnackBar(err.message,  MrvConstants.LOG_ERROR);
    })

  }

  updateDataStaus(status){
    let obj = {
        status : status,
        _id : this.routeRecordId,
        approvedBy : JSON.parse(localStorage.getItem('loggedInUser')) ? JSON.parse(localStorage.getItem('loggedInUser'))._id : '',
        approverComment : this.approverCommentCtrl.value
      }

    this._ts.updateDataStatus(obj).subscribe(res=>{
      if(res.statusCode ==200){
        this.utilityService.openSnackBar(res.message, MrvConstants.LOG_SUCCESS);
        this.router.navigate(['./my-approvals']);
      }
      else{
        this.utilityService.openSnackBar(res.message, MrvConstants.LOG_ERROR);
      }
    }, err=>{
      this.utilityService.openSnackBar(err.message, MrvConstants.LOG_ERROR);
    })
  }


}
