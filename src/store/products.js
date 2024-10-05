// src/redux/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/products`;

const initialState = {
    products: [],
    loading: false,
    error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (data) => {
    const response = await axios.get(API_URL, {
        params: {
            limit: data.pageSize, 
            page: data.page,        
        }
    });
    return response.data;
});

// Add a new product
export const addProduct = createAsyncThunk('products/addProduct', async (newProduct) => {
    const response = await axios.post(API_URL, newProduct);
    return response.data;
    
});

// Edit an existing product
export const editProduct = createAsyncThunk('products/editProduct', async ({ id, updatedProduct }) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedProduct);
    return response.data;
});

// Delete a product
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id; 
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get products
            .addCase(fetchProducts.pending, (state) => {

                return ({ ...state, loading: true, error: null })
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {

                return ({ ...state, loading: false, error: null, products: action.payload })

            })
            .addCase(fetchProducts.rejected, (state, action) => {
                return ({ ...state, loading: false, error: action.error.message })


            })

            // Add product
            .addCase(addProduct.pending, (state) => {
                return ({ ...state, loading: true, error: null })

            })
            .addCase(addProduct.fulfilled, (state, action) => {

                return ({ ...state, loading: false, error: null })

            })
            .addCase(addProduct.rejected, (state, action) => {
                return ({ ...state, loading: false, error: action.error.message })

            })

            // Edit product
            // .addCase(editProduct.pending, (state) => {
            //     return ({ ...state, loading: true, error: null })

            // })
            // .addCase(editProduct.fulfilled, (state, action) => {
            //     return ({ ...state, loading: false, error: null })

            // })
            // .addCase(editProduct.rejected, (state, action) => {
            //     return ({ ...state, loading: false, error: action.error.message })

            // })

            // Delete product
            // .addCase(deleteProduct.pending, (state) => {
            //     return ({ ...state, loading: true, error: null })

            // })
            // .addCase(deleteProduct.fulfilled, (state, action) => {
            //     return ({ ...state, loading: false, error: null })

            // })
            // .addCase(deleteProduct.rejected, (state, action) => {
            //     return ({ ...state, loading: false, error: action.error.message })

            // });
    },
});

export default productsSlice.reducer;
