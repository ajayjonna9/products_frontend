import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, editProduct, addProduct } from '../store/products';
import { CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import ProductForm from './AddProduct'
import Modal from '@mui/material/Modal';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid2'
import CloseIcon from '@mui/icons-material/Close';
import NotificationSnackbar from '../helpers/NotificationSnackbar'


const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters long'),
    description: Yup.string()
        .required('Description is required')
        .min(3, 'Description must be at least 3 characters long'),
    price: Yup.number()
        .required('Selling price is required')
        .positive('Selling price must be a positive number'),
});

const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'isRecommended', label: 'Is Recommended', type: 'enum', options: [{ value: 1, label: "Yes" }, { value: 0, label: "No" }] },
    { name: 'status', label: 'Status', type: 'enum', options: [{ value: 1, label: "Available" }, { value: 0, label: "Not Available" }] },
    { name: 'isBestSeller', label: 'Is Best Seller', type: 'enum', options: [{ value: 1, label: "Yes" }, { value: 0, label: "No" }] },
];



const ProductsList = () => {
    const dispatch = useDispatch();
    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 200 },

        { field: 'price', headerName: 'SELLING PRICE', width: 130 },
        {
            field: 'isRecommended',
            headerName: 'RECOMANDED',
            renderCell: (params) => (
                <Switch
                    checked={params.row.isRecommended}
                    name='isRecommended'
                    onChange={(event) => handleChangeStatus(event, params.row._id)}
                />
            ),
            width: 120,
        },
        {
            field: 'isBestSeller',
            headerName: 'BEST SELLER',
            width: 120,
            renderCell: (params) => (
                <>
                    <Switch
                        checked={params.row.isBestSeller}
                        name='isBestSeller'
                        onChange={(event) => handleChangeStatus(event, params.row._id)}
                    />
                </>
            ),
        },

        {
            field: 'status',
            headerName: 'STATUS',
            width: 120,
            renderCell: (params) => (
                <Switch
                    checked={params.row.status}
                    name='status'
                    onChange={(event) => handleChangeStatus(event, params.row._id)}

                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div style={{ display: 'flex', gap: '20px', alignItems: "center", height: "100%" }}>
                    <EditOutlinedIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(params.row)}
                    />
                    <DeleteOutlineOutlinedIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDelete(params.row._id)}
                    />
                </div>
            ),
        },
    ];

    const { products, loading, error } = useSelector((state) => state.products);
    const [showProductForm, setShowProductForm] = useState(false)
    const [showProductEditForm, setShowProductEditForm] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    const [initialValues, setInitialValues] = useState({
        name: '',
        description: '',
        price: '',
        isRecommended: 0,
        status: 0,
        isBestSeller: 0,
    })
    const [rows, setRows] = useState(products.products);

    const [notification, setNotification] = useState({ message: '', severity: '' });

    const handleCloseNotification = () => {
        setNotification({ message: '', severity: '' });
    };

    const handleClose = () => {
        setShowProductForm(false)
        setShowProductEditForm(false)
    };
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const handleSubmit = (values) => {
        setShowProductForm(false)
        setShowProductEditForm(false)
        dispatch(addProduct(values)).then(res => {
            dispatch(fetchProducts(paginationModel));

            setNotification({ message: 'Product added successfully!', severity: 'success' });

        }).catch(error => {
            setNotification({ message: 'Failed to add product!', severity: 'error' });

        })

    };
    const handleEditForm = (values) => {
        setShowProductForm(false)
        setShowProductEditForm(false)
        setInitialValues({
            name: '',
            description: '',
            price: '',
            isRecommended: 0,
            status: 0,
            isBestSeller: 0,
        })
        dispatch(editProduct({ id: selectedId, updatedProduct: values })).then(res => {
            // dispatch(fetchProducts(paginationModel));
            const updatedRows = rows.map((row) => {
                if (row._id === selectedId) {
                    return { ...row, ...values };
                }
                return row;
            });
            setRows(updatedRows);
            setNotification({ message: 'Product updated successfully!', severity: 'success' });


        }).catch((error) => {
            setNotification({ message: 'Failed to update product!', severity: 'error' });
        });

    };

    const handlePaginationChange = (newPaginationModel) => {


        setPaginationModel(newPaginationModel);
    };
    const handleChangeStatus = (event, id) => {
        let obj = {}
        const updatedRows = rows.map((row) => {
            if (row._id === id) {
                obj = { ...row, [event.target.name]: Number(event.target.checked) }
                return { ...row, [event.target.name]: Number(event.target.checked) };
            }
            return row;
        });
        delete obj._id;
        delete obj.__v;
        dispatch(editProduct({ id: id, updatedProduct: obj })).then(res => {
            setRows(updatedRows);
            setNotification({ message: 'Product updated successfully!', severity: 'success' });

        }).catch((error) => {
            setNotification({ message: 'Failed to update product!', severity: 'error' });
        });


    };
    const handleDelete = (id) => {
        dispatch(deleteProduct(id)).then(res => {
            dispatch(fetchProducts(paginationModel));
            setNotification({ message: 'Product deleted successfully!', severity: 'success' });
        }).catch(error => {
            setNotification({ message: 'Failed to delete product!', severity: 'error' });

        })
    };
    const handleEdit = (row) => {
        setShowProductEditForm(true)
        setSelectedId(row._id)
        setInitialValues(
            {
                name: row.name,
                description: row.description,
                price: row.price,
                isRecommended: row.isRecommended,
                status: row.status,
                isBestSeller: row.isBestSeller,
            }
        )
    };


    const onClickAddProduct = () => {
        setShowProductForm(true)
    }
    useEffect(() => {
        setRows(products.products);
    }, [products.products]);

    useEffect(() => {
        dispatch(fetchProducts(paginationModel));
    }, [paginationModel, dispatch]);

    useEffect(() => {
        if (error) {
            setNotification({ message: 'Something wrong!', severity: 'error' })
        }
    }, [error]);
    if (loading) return <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", top: "50%", right: "50%" }}> <CircularProgress /></Box>;
    if (error) return;

    return (
        <div style={{    backgroundColor: "aliceblue"       }}>
            <Typography sx={{
                textAlign: "center",
                padding: "10px",
                fontSize: "larger"
            }}>Product Palette</Typography>
            <Box sx={{
                textAlign: "end",
                marginBottom: "10px",
                marginTop: "10px",
                marginRight: "10px"
            }}>
                <Button onClick={onClickAddProduct}><AddIcon />ADD PRODUCT</Button>
            </Box>
            <Paper sx={{ width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationChange}
                    pageSizeOptions={[5, 10, 15, 20, 25]}
                    rowCount={products.totalCount}
                    sx={{ border: 0 }}
                />
            </Paper>
            <Modal
                open={showProductForm || showProductEditForm}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">

                <Grid container spacing={2} sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: " 100%"
                }}>
                    <Grid size={{ xs: 11, md: 5 }}>

                        <Box sx={{ backgroundColor: "white", position: "relative", borderRadius: "5px" }}>
                            <ProductForm
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={showProductForm ? handleSubmit : handleEditForm}
                                fields={fields}
                            />
                            <Box sx={{ position: "absolute", top: "12px", right: '10px' }}>
                                <Button onClick={handleClose}>
                                    <CloseIcon />
                                </Button>


                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Modal>

            {notification.message &&
                <NotificationSnackbar
                    message={notification.message}
                    severity={notification.severity}
                    onClose={handleCloseNotification}
                />}

        </div>
    );
};

export default ProductsList;

