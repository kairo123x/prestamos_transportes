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