# MRV App — Product Requirements Document (PRD)

_Last updated: 2025-08-24-013241_

This PRD defines **functional parity (or better)** between the legacy MRV app and the upgraded **Angular 20 + Material 3** solution.

## Feature Inventory (auto-discovered from legacy `/src/app/views/*`)

| Module                           | Notes                             |
| -------------------------------- | --------------------------------- |
|                                  | Feature module from legacy /views |
| GHG                              | Feature module from legacy /views |
| Mitigation                       | Feature module from legacy /views |
| adaptation-monitoringinformation | Feature module from legacy /views |
| adaptation-projectinformation    | Feature module from legacy /views |
| adaptation-tracking              | Feature module from legacy /views |
| btsw                             | Feature module from legacy /views |
| cement-production                | Feature module from legacy /views |
| climate-finance                  | Feature module from legacy /views |
| common                           | Feature module from legacy /views |
| cropland                         | Feature module from legacy /views |
| dashboard                        | Feature module from legacy /views |
| database                         | Feature module from legacy /views |
| database-afolu                   | Feature module from legacy /views |
| database-energy                  | Feature module from legacy /views |
| database-ippu                    | Feature module from legacy /views |
| efbb                             | Feature module from legacy /views |
| electricity-generation           | Feature module from legacy /views |
| emissionfactor-livestock         | Feature module from legacy /views |
| enteric-fermentation             | Feature module from legacy /views |
| error                            | Feature module from legacy /views |
| forest-land                      | Feature module from legacy /views |
| forgotpassword                   | Feature module from legacy /views |
| ghg-report                       | Feature module from legacy /views |
| ghginventory-yearwise            | Feature module from legacy /views |
| grassland                        | Feature module from legacy /views |
| gwp-database                     | Feature module from legacy /views |
| inemm                            | Feature module from legacy /views |
| iobw                             | Feature module from legacy /views |
| lime-production                  | Feature module from legacy /views |
| login                            | Feature module from legacy /views |
| lubricant-use                    | Feature module from legacy /views |
| manufacturing                    | Feature module from legacy /views |
| manure-management                | Feature module from legacy /views |
| menu                             | Feature module from legacy /views |
| modal                            | Feature module from legacy /views |
| model                            | Feature module from legacy /views |
| mrv-tracking                     | Feature module from legacy /views |
| my-approvals                     | Feature module from legacy /views |
| ndc                              | Feature module from legacy /views |
| notifications                    | Feature module from legacy /views |
| other-lands                      | Feature module from legacy /views |
| other-sdg-bottom-sheet           | Feature module from legacy /views |
| others                           | Feature module from legacy /views |
| posf                             | Feature module from legacy /views |
| question                         | Feature module from legacy /views |
| reference-approach               | Feature module from legacy /views |
| register                         | Feature module from legacy /views |
| report-by-gas                    | Feature module from legacy /views |
| rice-cultivation                 | Feature module from legacy /views |
| rnac                             | Feature module from legacy /views |
| screen-access                    | Feature module from legacy /views |
| sdg                              | Feature module from legacy /views |
| sdg-projectinformation           | Feature module from legacy /views |
| settlements                      | Feature module from legacy /views |
| shared                           | Feature module from legacy /views |
| solidwaste-disposal              | Feature module from legacy /views |
| solvent-use                      | Feature module from legacy /views |
| theme                            | Feature module from legacy /views |
| transport                        | Feature module from legacy /views |
| user-management                  | Feature module from legacy /views |
| userlist                         | Feature module from legacy /views |
| waiste                           | Feature module from legacy /views |
| waste-population                 | Feature module from legacy /views |
| wetland                          | Feature module from legacy /views |
| widgets                          | Feature module from legacy /views |
| wtd                              | Feature module from legacy /views |

## API Contracts (parsed from `app.constants.ts` if present)

### Auth & Users

| Constant               | Path                      |
| ---------------------- | ------------------------- |
| MRV_FORGOT_PASSWORD    | /user/forgot-password/otp |
| MRV_LOGIN              | /user/login               |
| MRV_RESET_PASSWORD     | /user/reset/password      |
| MRV_UPDATE_PASSWORD    | /user/password            |
| MRV_UPDATE_USER_STATUS | /user/updateStatus        |
| MRV_USER               | /user                     |

### Shared

| Constant                     | Path                      |
| ---------------------------- | ------------------------- |
| CHECK_FILE_BY_MENU           | /shared/fileByMenu        |
| DOWNLOAD_FILE                | /shared/download          |
| MRV_GHG_REPORT_TEMPLATE_LINK | /shared/download/template |
| MRV_NDC_SECTOR_MAPPING       | /shared/ndc/sectorMapping |
| MRV_REPORT_YEARS             | /shared/report/years      |
| MRV_SHARED_APP_DATA          | /shared/appdata           |
| MRV_SHARED_RECORD            | /shared/record            |
| UPLOAD_FILE                  | /shared/upload/           |

### GHG

| Constant                                 | Path                                       |
| ---------------------------------------- | ------------------------------------------ |
| MRV_FUEL_BY_FUEL_TYPE                    | /ghg/fuelByFuelType/                       |
| MRV_FUEL_TYPE                            | /ghg/fuelType                              |
| MRV_GHG_DATA                             | /ghg/data                                  |
| MRV_GHG_ENERGY_ELECTRICITY_GENERATION    | /ghg/energy/sectoral/electricityGeneration |
| MRV_GHG_ENERGY_MANUFACTURING             | /ghg/energy/sectoral/manufacturing         |
| MRV_GHG_ENERGY_OTHERS                    | /ghg/energy/sectoral/others                |
| MRV_GHG_ENERGY_PRODUCTION_OF_SOLID_FUELS | /ghg/energy/sectoral/productionOfSolid     |
| MRV_GHG_ENERGY_REFERENCE_APPROACH        | /ghg/energy/referenceApproach              |
| MRV_GHG_ENERGY_TRANSPORT                 | /ghg/energy/sectoral/transport             |
| MRV_GHG_IPPU_CEMENT                      | /ghg/ippu/cement                           |
| MRV_GHG_IPPU_LIME                        | /ghg/ippu/lime                             |
| MRV_GHG_IPPU_LUBRICANT                   | /ghg/ippu/lubricant                        |
| MRV_GHG_IPPU_RNAC                        | /ghg/ippu/airConditioning                  |
| MRV_GHG_IPPU_SOLVENT                     | /ghg/ippu/solvent                          |
| MRV_GHG_REPORT                           | /ghg/report                                |
| MRV_GHG_SECTOR_MAPPING                   | /ghg/sectorDetails                         |
| MRV_GHG_SECTOR_MAPPING_BY_MENU           | /ghg/sectorDetailsByMenu                   |
| MRV_GHG_WASTE_BIO_TREATMENT              | /ghg/waste/biologicalTreatment             |
| MRV_INVENTORY_YEAR                       | /ghg/inventoryYear                         |
| MRV_REPORT_GAS                           | /ghg/report/gas                            |
| SOLID_WASTE_DISPOSAL                     | /ghg/waste/solidWasteDisposal              |

### Databases

| Constant                            | Path                            |
| ----------------------------------- | ------------------------------- |
| MRV_DATABASE_AFOLU_EMISSION_FACTOR  | /database/afolu/emissionFactor  |
| MRV_DATABASE_AFOLU_POPULATION       | /database/afolu/population      |
| MRV_DATABASE_ENERGY_EMISSION_FACTOR | /database/energy/emissionFactor |
| MRV_DATABASE_ENERGY_FUGITIVE        | /database/energy/fugitive       |
| MRV_DATABASE_IPPU_EMISSION_FACTOR   | /database/ippu/emissionFactor   |
| MRV_DATABASE_IPPU_EMMISION_FACTOR   | /database/ippu/emissionFactor   |
| MRV_DATABASE_IPPU_GWP               | /database/ippu/gwp              |
| MRV_DATABASE_WASTE_POPULATION       | /database/waste/population      |
| MRV_GHG_AFOLU_EMISSIONFACTOR        | /database/afolu/emissionFactor  |

### NDC / Mitigation

| Constant                  | Path                 |
| ------------------------- | -------------------- |
| MRV_MITIGATION_REPORT     | /ndc/report          |
| MRV_NDC                   | /ndc                 |
| MRV_NDC_PROJECT_BY_MODULE | /ndc/projectByModule |

---

## Acceptance Criteria (selected)

- All discovered feature routes exist in the upgraded app with equivalent CRUD and validations.
- Calls to legacy endpoints succeed (or are adapted) with proper auth headers.
- Reporting outputs match legacy app given the same dataset.
- Approvals/MRV workflow (states, notes) preserved.
- Upload/download templates function with progress + error handling.

## Betterments

- Material 3 theme, accessible components (WCAG 2.1 AA), responsive layout.
- Angular interceptors/guards, consistent error toasts, typed services.
- Unit tests (Jest) + E2E (Cypress); Dockerized dev/prod; SSL in prod.
