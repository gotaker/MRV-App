import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../../../../app.service';
import { MrvConstants } from '../../../../../../mrv-constant';
import { ColumnNameConfig } from '../../../../../../shared/data-table/column-name-config';
import { UtilityServiceService } from '../../../../../../utility-service.service';
import { SectorDetailsRequest } from '../../../../../model/common/sector-details-request';

@Component({
  selector: 'app-ghg-urea-application',
  templateUrl: './ghg-urea-application.component.html',
  styleUrls: ['./ghg-urea-application.component.scss']
})
export class GhgUreaApplicationComponent implements OnInit {

  // form
  public title: string;
  public menuId: string;
  public formGroup: FormGroup;
  public yearList: number[];
  public sectorArr: string[] = [];
  public subSectorArr: string[] = [];
  public categoryArr: string[] = [];
  public routeFormId: string;
  public routeRecordId: string;
  remarkCtrl = new FormControl('', [Validators.required]);
  approverCommentCtrl = new FormControl('');
  approvalScreen = false;
  // data table config
  columnNameConfig: ColumnNameConfig[] = [];
  dataList: any[] = [];
  newRec: any;
  dataTableTitle: string;
  showAddNew: boolean = true;
  showAction: boolean = true;
  showDelete: boolean = true;
  constructor(private activatedRoute: ActivatedRoute, private appService: AppService,
    private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private router: Router,
    private utilityService: UtilityServiceService) {

  }
  ngOnInit() {
    this.setDataTableConfig();
    // create form 
    this.buildForm();
    // reading details from routeParams
    this.getBasicDataFromRoute();
    // get years
    this.getYears();
    this.checkForApprovalPage();
  }
  checkForApprovalPage() {
    this.approvalScreen = false;
    this.routeFormId = this.activatedRoute.snapshot.paramMap.get('formId');
    this.routeRecordId = this.activatedRoute.snapshot.paramMap.get('recordId');
    if (this.routeFormId) {
      this.approvalScreen = true;
      this.loadActivityData('_id', this.routeFormId);
    }

  }
  private setDataTableConfig() {
    this.columnNameConfig = [
      {
        id: "subCategory",
        value: "Sub Category",
        type: "text",
        placeHolder: "",
      },
      {
        id: "ureaApplied",
        value: "Urea Applied (tonne per Year)",
        type: "number",
        placeHolder: "",
      },
      {
        id: "emissionFactor",
        value: "Emission Factor (tC/ton of Urea produced)",
        type: "number",
        placeHolder: "",
      },
      {
        id: "reference",
        value: "Reference",
        type: "text",
        placeHolder: "",
      }
    ];
    this.newRec = {
      subCategory:"",
      ureaApplied :0,
      emissionFactor:0.2,
      reference:"",
    };
    this.dataTableTitle = "Urea Application Data";
  }

  loadActivityData(loadType, value) {
    var obj = {
      menuId: this.menuId,
      [loadType]: value
    }
    this.appService.getDataRecord(obj).subscribe((res: any) => {
      if (res.statusCode == 200 && res.data) {
        if (loadType != "_id" && res.data.length) {
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
  resetData() {
    this.formGroup.reset();
    this.dataList = [];
    this.populateSectorDetails();
  }
  setFormValue(data: any) {
    console.log(this.sectorArr, this.categoryArr, this.subSectorArr);

    this.remarkCtrl.patchValue(data.remark);
    this.formGroup.controls.inventoryYear.patchValue(data.inventoryYear);
    this.formGroup.controls.sector.patchValue(data.sector);
    this.formGroup.controls.category.patchValue(data.category);
    this.formGroup.controls.subSector.patchValue(data.subSector);
    this.formGroup.controls.calculationApproach.patchValue(data.calculationApproach);
    this.dataList = data.ureaData;
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      _id: [''],
      inventoryYear: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      subSector: ['', [Validators.required]],
      category: ['', [Validators.required]],
      calculationApproach: ['', [Validators.required]],
      remark: this.remarkCtrl
    });

  }

  private getBasicDataFromRoute() {
    this.activatedRoute.data.subscribe(routeData => {
      this.menuId = routeData.menuId;
      this.title = routeData.title;
      let payload: SectorDetailsRequest = {
        menuId: routeData.menuId,
        subSector: routeData.subSector
      }
      this.utilityService.sectorDetailsForGHGByMenu(payload, (response) => {
        this.sectorArr = response.sectorArr;
        this.categoryArr = response.categoryArr;
        this.subSectorArr = response.subSectorArr;
        this.populateSectorDetails();
      });
    });
  }
  /*
  * used to populate sector details after db call
  */
  populateSectorDetails() {
    this.formGroup.controls.sector.patchValue(this.sectorArr.length ? this.sectorArr[0] : "");
    this.formGroup.controls.category.patchValue(this.categoryArr.length ? this.categoryArr[0] : "");
    this.formGroup.controls.subSector.patchValue(this.subSectorArr.length ? this.subSectorArr[0] : "");
  }

  getYears() {
    this.appService.getInventoryYears('mannual').subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.yearList = res.data;
      }
    }, err => {
    })
  }

  submit() {
    console.log("formGroup  ", this.formGroup);

    if (this.formGroup.status == "INVALID") {
      this.formGroup.markAllAsTouched();
      return;
    }
    var obj = {
      inventoryYear: this.formGroup.controls.inventoryYear.value,
      sector: this.formGroup.controls.sector.value,
      subSector: this.formGroup.controls.subSector.value,
      category: this.formGroup.controls.category.value,
      calculationApproach: this.formGroup.controls.calculationApproach.value,

      ureaData: this.dataList,
      updatedBy: JSON.parse(localStorage.getItem('loggedInUser'))._id,
      remark: this.remarkCtrl.value,
      menuId: this.menuId,
    };

    // console.log(obj);

    this.appService.saveRecord(obj).subscribe((res: any) => {
      this.utilityService.openSnackBar(res.message, MrvConstants.LOG_SUCCESS);
      this.resetData();
    }, err => {
      this.utilityService.openSnackBar(err.message, MrvConstants.LOG_ERROR);
    })
  }



  updateDataStatus(status) {
    let obj = {
      status: status,
      _id: this.routeRecordId,
      approvedBy: JSON.parse(localStorage.getItem('loggedInUser')) ? JSON.parse(localStorage.getItem('loggedInUser'))._id : '',
      approverComment: this.approverCommentCtrl.value
    }

    this.appService.updateDataStatus(obj).subscribe(res => {
      if (res.statusCode == 200) {
        this.router.navigate(['./my-approvals']);
        this.utilityService.openSnackBar(res.message, MrvConstants.LOG_SUCCESS);
      }
      else {
        this.utilityService.openSnackBar(res.message, MrvConstants.LOG_ERROR);
      }
    }, err => {
      this.utilityService.openSnackBar(err.message, MrvConstants.LOG_ERROR);
    })
  }
}

