export interface ProvidersInterface {
   idprovider?: number;
   name?: string;
   alias?:string;
   rfc?:string;
   billing_email?:string;
   office_phone?:number;
   care_contact?:string;
   care_email?:string;
   care_phone?:number;
   skus?:string;
   status?: string;
   logo?: string;
   is_deleted?: boolean;
   created_by?: number;
   created_at?: string;
   modified_at?: string;
}

