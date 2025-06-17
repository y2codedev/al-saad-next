import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  List,
  ListItem,
} from "@mui/material";

const ProductDetailsTable = ({ productDetails }) => (
  <Table sx={{ maxWidth: "100%" }}>
    <TableBody>
      <TableRow>
        <TableCell>
          <List>
            <ListItem>{productDetails.comforter}</ListItem>
            <ListItem>{productDetails.fittedSheet}</ListItem>
            <ListItem>{productDetails.pillowShams}</ListItem>
          </List>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <strong>Color:</strong>
        </TableCell>
        <TableCell>{productDetails.color}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <strong>Material:</strong>
        </TableCell>
        <TableCell>{productDetails.material}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export default ProductDetailsTable;
