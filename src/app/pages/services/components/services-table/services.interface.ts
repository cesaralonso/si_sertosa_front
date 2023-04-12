export interface ServicesInterface {
   idservice?: number;
   name?: string;
   initialMessage?: string;
   finalMessage?: string;
   emailMessage?: string;
   downloable?: boolean;
   showEmployee?: boolean;
   target?: string;
   time?: number;
   saveAsTemplate?: boolean;


   employees?: any;
   products? : any;
   familys?: any;
   project_idproject?: number;
   company_logo?: string;
   company_name?: string;
   companyunits_name?: string;
   companygroup_name?: string;
   family?: any;


   is_deleted?: boolean;
   created_at?: string;
   created_by?: number;
   modified_at?: string;
}
