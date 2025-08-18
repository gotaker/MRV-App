import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MRV_INVENTORY_YEAR, MRV_FUEL_TYPE, MRV_FUEL_BY_FUEL_TYPE, MRV_APPROVALS, MRV_GHG_ENERGY_PRODUCTION_OF_SOLID_FUELS } from '../../app.constants';
import { ApiResponseModel } from '../model/api.response.model';

@Injectable({
  providedIn: 'root'
})
export class PosfService {
  public myHeaders = new HttpHeaders({
    "content-type" : "Application/json" , 
    'authorization' : 'bearer '+localStorage.getItem('tokenId')
  })
  public getHeader() : HttpHeaders{
    let token = 'bearer '+localStorage.getItem('tokenId');
    return new HttpHeaders().set("Content-Type" , "Application/json" ).set("authorization" , token);
  }
  constructor( private http : HttpClient) { }

  public getInventoryYears(type?:any){
    if(type){
      return this.http.get<ApiResponseModel>(`${MRV_INVENTORY_YEAR+"?config="+type}`, {
        headers: this.getHeader(),
      });
    }
    else{
      return this.http.get<ApiResponseModel>(`${MRV_INVENTORY_YEAR}`, {
        headers: this.getHeader(),
      });
    }
    // return this.http.get<ApiResponseModel>(`${MRV_INVENTORY_YEAR+"?config="+type}`  , {headers : this.getHeader()});
  }

  public getDataState(type){
    return this.http.get<ApiResponseModel>(MRV_APPROVALS+type , {headers : this.getHeader()});
  }

  public getEData(obj){
    let params = new HttpParams().set("filterType", obj.type).set("value", obj.value);
    return this.http.get<ApiResponseModel>(MRV_GHG_ENERGY_PRODUCTION_OF_SOLID_FUELS , {headers : this.getHeader(), params : params});
  }

  public saveProductionOfSolidFuels(body){
    return this.http.post<ApiResponseModel>(`${MRV_GHG_ENERGY_PRODUCTION_OF_SOLID_FUELS}` , body, {headers : this.getHeader()});
  }

  public updateDataStatus(body){
    return this.http.put<ApiResponseModel>(MRV_APPROVALS+'status' ,body,  {headers : this.getHeader()});
  }

}