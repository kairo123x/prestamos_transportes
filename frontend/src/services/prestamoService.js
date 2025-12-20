import apiClient from "./interceptor";

const API_URL = import.meta.env.VITE_API_URL || 'localhost:3000';

const rutaGeneral = API_URL+'/prestamos';

export const listarProductos = async (search) => {
    try {
        const response = await apiClient.get(rutaGeneral+'/lista-productos',{
            params:{
                search: search
            }
        });
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const listarMaterialesAsignados = async (dni) => {
    try {
        const response = await apiClient.get(rutaGeneral+'/materiales-asignados', {
            params:{
                dni: dni 
            }
        });
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const listarMaterialesAsignadosTotal = async (dni) => {
    try {
        const response = await apiClient.get(rutaGeneral+'/materiales-asignados-total');
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const asignarMaterial = async (data) => {
    try {
        const response = await apiClient.post(rutaGeneral+'/asignar-marterial', {
            dni: data.dni, 
            codEmpresa: data.codEmpresa, 
            tipoProducto: data.tipoProducto, 
            codProducto: data.codProducto, 
            descripcionProducto: data.descripcionProducto, 
            cantidad: data.cantidad, 
            fechaAsignada: data.fechaAsignada
        });
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const listarTrabajadores = async () => {
    try {
        const response = await apiClient.get(rutaGeneral+'/listar-trabajadores');
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const ConsumirMaterialAsignado = async (data) => {
    try {
        const response = await apiClient.post(rutaGeneral+'/consumir-material-asignado', data);
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const ListarPrestamosRealizados = async (dniPrestador) => {
    try {
        const response = await apiClient.get(rutaGeneral+'/listar-prestamos-realizados', {
            params: {
                dniPrestador: dniPrestador
            }
        });
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const ListarPrestamosRecibidos = async (dniRecepcionador) => {
    try {
        const response = await apiClient.get(rutaGeneral+'/listar-prestamos-recibidos', {
            params: {
                dniRecepcionador: dniRecepcionador
            }
        });
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const PrestarMaterial = async (data) => {
    try {
        const response = await apiClient.post(rutaGeneral+'/prestar-material', data);
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const aprobarMaterialRecibido = async (data) => {
    try {
        const response = await apiClient.post(rutaGeneral+'/aprobar-material-recibido', data); 
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}

export const listarMaterialesTrabajadorCombinado = async (dni) => {
    try {
        const response = await apiClient.get(rutaGeneral+'/materiales-trabajador-combinado', {
            params: {
                dni: dni
            }
        });
        return response;
    } catch (error) {
        console.error('Error', error);
    }
}