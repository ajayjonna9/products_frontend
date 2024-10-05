import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const ProductForm = ({ initialValues, validationSchema, onSubmit, fields }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, handleChange }) => (
                <Form style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    height: "fit-content",
                    padding: "20px"
                }}>
                    <Typography variant="h5" gutterBottom>
                        Product Form
                    </Typography>

                    {fields.map((field) => {
                        if (field.type === 'enum') {
                            return (
                                <FormControl fullWidth key={field.name}>
                                    <InputLabel>{field.label}</InputLabel>
                                    <Select
                                        id={field.name}
                                        name={field.name}
                                        value={values[field.name]}
                                        onChange={handleChange}
                                        label={field.label}
                                    >
                                        {field.options.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <ErrorMessage name={field.name} component="div" style={{ color: 'red' }} />
                                </FormControl>
                            );
                        } else {
                            return (
                                <Field
                                
                                    key={field.name}
                                    name={field.name}
                                    as={TextField}
                                    label={field.label}
                                    variant="outlined"
                                    fullWidth
                                    type={field.type}
                                    required={field.required }
                                    helperText={<ErrorMessage name={field.name} component="div" style={{ color: 'red' }} />}
                                />
                            );
                        }
                    })}

                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default ProductForm;
