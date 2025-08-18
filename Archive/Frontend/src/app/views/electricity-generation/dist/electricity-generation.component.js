"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ElectricityGenerationComponent = void 0;
var collections_1 = require("@angular/cdk/collections");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var snackbar_dialog_component_1 = require("../modal/snackbar-dialog/snackbar-dialog.component");
var ElectricityGenerationComponent = /** @class */ (function () {
    function ElectricityGenerationComponent(_fb, _egs, _activatedRoute, _snackBar, router, appService) {
        this._fb = _fb;
        this._egs = _egs;
        this._activatedRoute = _activatedRoute;
        this._snackBar = _snackBar;
        this.router = router;
        this.appService = appService;
        this.dataList = [];
        this.newlyAddedList = [];
        // Table related declarations
        // table related declarations
        this["true"] = true;
        this.displayedColumns = [];
        this.dataSource = new material_1.MatTableDataSource(this.dataList);
        this.newDataSource = new material_1.MatTableDataSource(this.newlyAddedList);
        this.fuelTypeCtrl = new forms_1.FormControl();
        this.fuelCtrl = new forms_1.FormControl();
        this.unitCtrl = new forms_1.FormControl();
        this.amountCtrl = new forms_1.FormControl();
        this.referenceCtrl = new forms_1.FormControl();
        this.selection = new collections_1.SelectionModel(true, []);
        this.newSelection = new collections_1.SelectionModel(true, []);
        this.columnNames = [
            { id: 'fuelType', value: 'Fuel Type', formControl: this.fuelTypeCtrl },
            { id: 'fuel', value: 'Fuel', formControl: this.fuelCtrl },
            { id: 'unit', value: 'Unit', formControl: this.unitCtrl },
            { id: 'amount', value: 'Amount', formControl: this.amountCtrl },
            { id: 'reference', value: 'Reference', formControl: this.referenceCtrl }
        ];
        this.filteredValues = {
            fuelType: '', fuel: '', unit: '', amount: '', reference: ''
        };
        this.remarksCtrl = new forms_1.FormControl();
        this.approverCommentCtrl = new forms_1.FormControl();
        this.dataList = [];
        this.newlyAddedList = [];
        this.dataSource.data = this.dataList;
        this.newDataSource.data = this.newlyAddedList;
        this.approvalScreen = false;
        this.routeFormId = this._activatedRoute.snapshot.paramMap.get('formId');
        this.routeRecordId = this._activatedRoute.snapshot.paramMap.get('recordId');
        if (this.routeFormId) {
            this.approvalScreen = true;
            this.loadActivityData('_id', this.routeFormId);
        }
        this.formGroup = this._fb.group({
            inventoryYear: [null, [forms_1.Validators.required]],
            sector: ['1-Energy', [forms_1.Validators.required]],
            subSector: ['1.A.1-Energy Industries', [forms_1.Validators.required]],
            category: ['1.A-Fuel Combustion Activities', [forms_1.Validators.required]],
            subCategory: [null, [forms_1.Validators.required]],
            calculationApproach: ['Tier I', [forms_1.Validators.required]]
        });
    }
    ElectricityGenerationComponent_1 = ElectricityGenerationComponent;
    Object.defineProperty(ElectricityGenerationComponent.prototype, "matSort", {
        set: function (ms) {
            this.sort = ms;
            this.setDataSourceAttributes();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ElectricityGenerationComponent.prototype, "matPaginator", {
        set: function (mp) {
            this.paginator = mp;
            this.setDataSourceAttributes();
        },
        enumerable: false,
        configurable: true
    });
    ElectricityGenerationComponent.prototype.getPermissionMenuId = function () {
        var _this = this;
        this.appService.getRecord(ElectricityGenerationComponent_1.Constants.MENU_ID).subscribe(function (res) {
            if (res.data) {
                _this.menu = res.data;
            }
        }, function (err) {
        });
    };
    ElectricityGenerationComponent.prototype.loadActivityData = function (type, value) {
        var _a;
        var _this = this;
        var obj = (_a = {
                menuId: ElectricityGenerationComponent_1.Constants.MENU_ID
            },
            _a[type] = value,
            _a);
        if (type == 'inventoryYear') {
            obj.subCategory = this.formGroup.controls['subCategory'].value;
        }
        this.dataList = [];
        this.dataSource.data = this.dataList;
        if (obj) {
            this.appService.getDataRecord(obj).subscribe(function (res) {
                if (res.statusCode == 200 && res.data.energyData) {
                    _this.formGroup.controls['inventoryYear'].setValue(res.data.inventoryYear);
                    _this.formGroup.controls['sector'].setValue(res.data.sector);
                    _this.formGroup.controls['calculationApproach'].setValue(res.data.calculationApproach);
                    _this.formGroup.controls['subSector'].setValue(res.data.subSector);
                    _this.formGroup.controls['category'].setValue(res.data.category);
                    if (_this.approvalScreen) {
                        _this.formGroup.controls['subCategory'].setValue(res.data.subCategory);
                    }
                    _this.remarksCtrl.setValue(res.data.remark);
                    _this.dataList = res.data.energyData;
                    _this.dataSource.data = _this.dataList;
                }
                else {
                    _this.openSnackBar('No Data Found', 'error');
                }
            }, function (err) {
                _this.openSnackBar('Something went erong... try again later', 'error');
            });
        }
    };
    ElectricityGenerationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.yearList = [];
        this.fuelTypes = [];
        this.fuelsByType = [];
        this.getYears();
        this.getFuelTypes();
        this.getPermissionMenuId();
        this.dataList = [];
        this.newlyAddedList = [];
        this.displayedColumns = this.columnNames.map(function (x) { return x.id; });
        if (!this.approvalScreen) {
            this.displayedColumns.push('actions');
            this.displayedColumns.unshift('select');
        }
        // this.dataSource = new MatTableDataSource(this.dataList);
        this.dataSource.paginator = this.paginator;
        this.newDataSource = new material_1.MatTableDataSource(this.newlyAddedList);
        this.referenceCtrl.valueChanges.subscribe(function (positionFilterValue) {
            _this.filteredValues['reference'] = positionFilterValue;
            _this.dataSource.filter = JSON.stringify(_this.filteredValues);
            _this.filteredValues['topFilter'] = false;
            _this.dataSource.filterPredicate = _this.customFilterPredicate();
        });
        this.amountCtrl.valueChanges.subscribe(function (positionFilterValue) {
            _this.filteredValues['amount'] = positionFilterValue;
            _this.dataSource.filter = JSON.stringify(_this.filteredValues);
            _this.filteredValues['topFilter'] = false;
            _this.dataSource.filterPredicate = _this.customFilterPredicate();
        });
        this.unitCtrl.valueChanges.subscribe(function (positionFilterValue) {
            _this.filteredValues['unit'] = positionFilterValue;
            _this.dataSource.filter = JSON.stringify(_this.filteredValues);
            _this.filteredValues['topFilter'] = false;
            _this.dataSource.filterPredicate = _this.customFilterPredicate();
        });
        this.fuelCtrl.valueChanges.subscribe(function (positionFilterValue) {
            _this.filteredValues['fuel'] = positionFilterValue;
            _this.dataSource.filter = JSON.stringify(_this.filteredValues);
            _this.filteredValues['topFilter'] = false;
            _this.dataSource.filterPredicate = _this.customFilterPredicate();
        });
        this.fuelTypeCtrl.valueChanges.subscribe(function (positionFilterValue) {
            _this.filteredValues['fuelType'] = positionFilterValue;
            _this.dataSource.filter = JSON.stringify(_this.filteredValues);
            _this.filteredValues['topFilter'] = false;
            _this.dataSource.filterPredicate = _this.customFilterPredicate();
        });
        this.dataSource.filterPredicate = this.customFilterPredicate();
    };
    ElectricityGenerationComponent.prototype.getYears = function () {
        var _this = this;
        this._egs.getInventoryYears().subscribe(function (res) {
            if (res.statusCode == 200) {
                _this.yearList = res.data;
            }
        }, function (err) {
        });
    };
    ElectricityGenerationComponent.prototype.getFuelTypes = function () {
        var _this = this;
        this._egs.getFuelTypes().subscribe(function (res) {
            if (res.statusCode == 200) {
                _this.fuelTypes = res.data;
            }
        }, function (err) {
        });
    };
    ElectricityGenerationComponent.prototype.isInvalid = function (form, field, errorValue) {
        if (errorValue == 'required' || 'ValidateDate') {
            return (form.get(field).invalid &&
                (form.get(field).touched || form.get(field).dirty) &&
                form.get(field).hasError(errorValue));
        }
        else if (errorValue == 'pattern') {
            return (form.get(field).invalid &&
                form.get(field).dirty &&
                !form.get(field).hasError('required') &&
                form.get(field).errors.pattern);
        }
        else if (errorValue == 'email') {
            return (form.get(field).invalid &&
                form.get(field).dirty &&
                !form.get(field).hasError('required') &&
                form.get(field).hasError('email'));
        }
    };
    ElectricityGenerationComponent.prototype.setDataSourceAttributes = function () {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    ElectricityGenerationComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.paginator = this.paginator;
    };
    ElectricityGenerationComponent.prototype.applyFilter = function (filterValue) {
        var filter = {
            fuelType: filterValue.trim().toLowerCase(),
            fuel: filterValue.trim().toLowerCase(),
            unit: filterValue.trim().toLowerCase(),
            amount: filterValue.trim().toLowerCase(),
            reference: filterValue.trim().toLowerCase(),
            topFilter: true
        };
        this.dataSource.filter = JSON.stringify(filter);
    };
    ElectricityGenerationComponent.prototype.customFilterPredicate = function () {
        var myFilterPredicate = function (data, filter) {
            var searchString = JSON.parse(filter);
            var fuelType = data.fuelType.toString().trim().toLowerCase().indexOf(searchString.fuelType.toLowerCase()) !== -1;
            var fuel = data.fuel.toString().trim().toLowerCase().indexOf(searchString.fuel.toLowerCase()) !== -1;
            var unit = data.unit.toString().trim().toLowerCase().indexOf(searchString.unit.toLowerCase()) !== -1;
            var amount = data.amount.toString().trim().toLowerCase().indexOf(searchString.amount.toLowerCase()) !== -1;
            var reference = data.reference.toString().trim().toLowerCase().indexOf(searchString.reference.toLowerCase()) !== -1;
            if (searchString.topFilter) {
                return fuelType || fuel || unit || amount || reference;
            }
            else {
                return fuelType && fuel && unit && amount && reference;
            }
        };
        return myFilterPredicate;
    };
    ElectricityGenerationComponent.prototype.getFuelsByType = function (fuel, id) {
        var _this = this;
        this._egs.getFuelByType(fuel).subscribe(function (res) {
            if (res.statusCode == 200) {
                _this.newlyAddedList.forEach(function (element) {
                    if (element.id == id) {
                        element.fuelsByType = res.data;
                    }
                });
            }
        }, function (err) {
        });
    };
    ElectricityGenerationComponent.prototype.isAllSelected = function () {
        var numSelected = this.selection.selected.length;
        var numRows = this.dataSource.data.length;
        return numSelected === numRows;
    };
    ElectricityGenerationComponent.prototype.isAllNewSelected = function () {
        var numSelected = this.newSelection.selected.length;
        var numRows = this.newDataSource.data.length;
        return numSelected === numRows;
    };
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    ElectricityGenerationComponent.prototype.masterToggle = function () {
        var _this = this;
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(function (row) { return _this.selection.select(row); });
    };
    ElectricityGenerationComponent.prototype.masterToggleNew = function () {
        var _this = this;
        this.isAllNewSelected() ?
            this.newSelection.clear() :
            this.newDataSource.data.forEach(function (row) { return _this.newSelection.select(row); });
    };
    /** The label for the checkbox on the passed row */
    ElectricityGenerationComponent.prototype.checkboxLabel = function (row) {
        if (!row) {
            return (this.isAllSelected() ? 'select' : 'deselect') + " all";
        }
        return (this.selection.isSelected(row) ? 'deselect' : 'select') + " row " + (row.position + 1);
    };
    ElectricityGenerationComponent.prototype.checkboxLabelNew = function (row) {
        if (!row) {
            return (this.isAllNewSelected() ? 'select' : 'deselect') + " all";
        }
        return (this.newSelection.isSelected(row) ? 'deselect' : 'select') + " row " + (row.position + 1);
    };
    ElectricityGenerationComponent.prototype.addNewRow = function () {
        var x = this.newlyAddedList.length;
        this.newlyAddedList.push({
            id: x + 1, fuelType: '', fuel: '', unit: 'tonnes', amount: 0, reference: '', fuelsByType: []
        });
        this.newDataSource.data = this.newlyAddedList;
    };
    ElectricityGenerationComponent.prototype.removeIndividuallyFromList = function (list, ele) {
        if (list == 'exist') {
            this.dataList.splice(ele, 1);
            this.dataSource.data = this.dataList;
        }
        if (list == 'new') {
            this.newlyAddedList.splice(ele, 1);
            this.newDataSource.data = this.newlyAddedList;
        }
    };
    ElectricityGenerationComponent.prototype.removeSelected = function (list) {
        if (list == 'exist') {
            var y_1 = new Set(this.selection.selected);
            this.dataList = this.dataList.filter(function (x) { return !y_1.has(x); });
            this.dataSource.data = this.dataList;
        }
        if (list == 'new') {
            var y_2 = new Set(this.newSelection.selected);
            this.newlyAddedList = this.newlyAddedList.filter(function (x) { return !y_2.has(x); });
            this.newDataSource.data = this.newlyAddedList;
        }
    };
    ElectricityGenerationComponent.prototype.openSnackBar = function (message, type) {
        this._snackBar.openFromComponent(snackbar_dialog_component_1.SnackbarDialogComponent, {
            duration: 3000,
            panelClass: 'snackbar-global',
            horizontalPosition: 'center',
            verticalPosition: 'top',
            data: {
                message: message,
                type: type
            }
        });
    };
    ElectricityGenerationComponent.prototype.saveElectricityGeneration = function () {
        var _this = this;
        var obj = {
            inventoryYear: this.formGroup.controls['inventoryYear'].value,
            sector: this.formGroup.controls['sector'].value,
            subSector: this.formGroup.controls['subSector'].value,
            category: this.formGroup.controls['category'].value,
            subCategory: this.formGroup.controls['subCategory'].value,
            calculationApproach: this.formGroup.controls['calculationApproach'].value,
            energyData: this.dataList.concat(this.newlyAddedList),
            updatedBy: JSON.parse(localStorage.getItem('loggedInUser'))._id,
            remark: this.remarksCtrl.value,
            menuId: ElectricityGenerationComponent_1.Constants.MENU_ID,
            permissionMenuId: this.menu.permissionMenuId
        };
        this.appService.saveRecord(obj).subscribe(function (res) {
            if (res.statusCode == 200) {
                _this.openSnackBar(res.message, 'success');
                _this.formGroup.controls['inventoryYear'].reset();
                _this.formGroup.controls['subCategory'].reset();
                _this.dataList = [];
                _this.dataSource.data = _this.dataList;
                _this.newlyAddedList = [];
                _this.newDataSource.data = _this.newlyAddedList;
            }
            else {
                _this.openSnackBar(res.message, 'error');
            }
        }, function (err) {
            _this.openSnackBar(err.message, 'error');
        });
    };
    ElectricityGenerationComponent.prototype.updateDataStaus = function (status) {
        var _this = this;
        var obj = {
            status: status,
            _id: this.routeRecordId,
            approvedBy: JSON.parse(localStorage.getItem('loggedInUser')) ? JSON.parse(localStorage.getItem('loggedInUser'))._id : '',
            approverComment: this.approverCommentCtrl.value
        };
        this._egs.updateDataStatus(obj).subscribe(function (res) {
            if (res.statusCode == 200) {
                _this.openSnackBar(res.message, 'success');
                _this.router.navigate(['./my-approvals']);
            }
            else {
                _this.openSnackBar(res.message, 'error');
            }
        }, function (err) {
            _this.openSnackBar(err.message, 'error');
        });
    };
    var ElectricityGenerationComponent_1;
    ElectricityGenerationComponent.Constants = {
        MENU_ID: 'GHG_Energy_Sectoral_Approach_Energy_Industries_Electricity_Generation'
    };
    __decorate([
        core_1.ViewChild(material_1.MatSort, { static: false })
    ], ElectricityGenerationComponent.prototype, "matSort");
    __decorate([
        core_1.ViewChild(material_1.MatPaginator, { static: false })
    ], ElectricityGenerationComponent.prototype, "matPaginator");
    ElectricityGenerationComponent = ElectricityGenerationComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-electricity-generation',
            templateUrl: './electricity-generation.component.html',
            styleUrls: ['./electricity-generation.component.scss']
        })
    ], ElectricityGenerationComponent);
    return ElectricityGenerationComponent;
}());
exports.ElectricityGenerationComponent = ElectricityGenerationComponent;
