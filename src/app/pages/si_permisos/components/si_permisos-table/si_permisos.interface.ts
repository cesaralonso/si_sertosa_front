export interface Si_permisosInterface {
   idsi_permiso?: number;
   codigo?: string;
   descripcion?: string;
   nombre?: string;
   si_rol_idsi_rol?: number;
   si_modulo_idsi_modulo?: number;
   acceso?: boolean;
   readable?: boolean;
   writeable?: boolean;
   updateable?: boolean;
   deleteable?: boolean;
   read_own?: boolean;
   write_own?: boolean;
   update_own?: boolean;
   delete_own?: boolean;
   is_deleted?: boolean;
   created_by?: number;
   created_at?: string;
   modified_at?: string;
}
