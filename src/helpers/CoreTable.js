
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Paper, 
} from '@mui/material';


const CoreTable = ({ columns, data }) => {
  

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} style={{ width: column.width || 'auto' }}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={row._id}>
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {column.renderCell
                      ? column.renderCell({ row }) 
                      : row[column.field]} 
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

     
    </Paper>
  );
};

export default CoreTable;

