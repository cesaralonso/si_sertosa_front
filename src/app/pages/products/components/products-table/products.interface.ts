export interface ProductsInterface {
   idproduct?: number;
   name?: string;
   description?: string;
   provider_idprovider?: number;
   family_idfamily?: number;
   sku?: string;
   aka?: string;
   type?: string;
   cost?: number;
   min?: number;
   id?: string;
   reorderpoint?: number;
   max?: number;
   caducity?: string;
   unitin?: string;
   unitout?: string;

   selected?: boolean;
   employees?: any;

   is_deleted?: boolean;
   created_by?: number;
   created_at?: string;
   modified_at?: string;
}
