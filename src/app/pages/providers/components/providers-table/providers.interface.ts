export interface ProvidersInterface {
   idprovider?: number;
   name?: string;
   alias?:string;
   rfc?:string;
   billing_email?:string;
   office_phone?:string;
   care_contact?:string;
   care_email?:string;
   care_phone?:string;
   /* skus?:string; */
   status?: string;
   logo?: string;
   is_deleted?: boolean;
   created_by?: number;
   created_at?: string;
   modified_at?: string;
}
