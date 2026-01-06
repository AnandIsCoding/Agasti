import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import { getAllOrders, updateDeliveryStatus } from "../../api/api.js";

// ---------------- STATUS COLORS ----------------
const statusColor = (status) =>
  status === "Delivered"
    ? "success"
    : status === "Pending"
      ? "warning"
      : status === "Cancelled"
        ? "error"
        : "info";

// ---------------- ORDER ROW ----------------
const OrderRow = ({ order, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [status, setStatus] = useState(order.deliveryStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdateDelivery = async () => {
    setLoading(true);
    try {
      const res = await updateDeliveryStatus(order._id, status);
      onUpdate(order._id, res.order.deliveryStatus);
      setOpenEdit(false);
    } catch (err) {
      console.error("Failed to update delivery status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ width: 40 }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Avatar src={order.products?.[0]?.img} variant="rounded" />
        </TableCell>

        <TableCell>
          <Typography fontWeight={600}>{order._id}</Typography>
        </TableCell>

        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
          {order.user?.name || "Unknown"}
        </TableCell>

        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
          ₹{order.totalAmount}
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={status} size="small" color={statusColor(status)} />
            <IconButton size="small" onClick={() => setOpenEdit(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>
        </TableCell>

        <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
          {new Date(order.orderDate).toLocaleString()}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <p>
                  <b>Customer:</b> {order.user?.name}
                </p>
                <p>
                  <b>Phone:</b> {order.address?.mobile}
                </p>
                <p>
                  <b>Payment Status:</b> {order.paymentStatus}
                </p>
                <p>
                  <b>Payment ID:</b> {order.payment || "-"}
                </p>
                <p className="sm:col-span-2">
                  <b>Address:</b>{" "}
                  {`${order.address?.address_line}, ${order.address?.city}, ${order.address?.state}, ${order.address?.country}`}
                </p>
                <p>
                  <b>Amount:</b> ₹{order.totalAmount}
                </p>
                <p>
                  <b>Date:</b> {new Date(order.orderDate).toLocaleString()}
                </p>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>
          Update Delivery — <b>{order._id}</b>
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <TextField
            select
            fullWidth
            label="Delivery Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateDelivery}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ---------------- MAIN PAGE ----------------
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getAllOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to fetch orders",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateDelivery = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, deliveryStatus: newStatus } : o,
      ),
    );
    setSnackbar({
      open: true,
      message: "Delivery status updated",
      severity: "success",
    });
  };

  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o._id.toLowerCase().includes(q) ||
        o.user?.name.toLowerCase().includes(q) ||
        o.address?.mobile.toString().includes(q) ||
        (o.payment || "").toLowerCase().includes(q),
    );
  }, [orders, search]);

  const paginatedOrders = useMemo(
    () =>
      filteredOrders.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [filteredOrders, page, rowsPerPage],
  );

  return (
    <Box className="p-4 sm:p-6">
      <Typography
        variant="h5"
        fontWeight={600}
        mb={3}
        className="bg-[#F5F0E5] py-4 px-2 rounded-sm"
      >
        Orders Management
      </Typography>

      <Box mb={2} maxWidth={360}>
        <TextField
          fullWidth
          size="small"
          label="Search order (ID, customer, phone, payment ID)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell>Order ID</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Customer
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  Amount
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedOrders.length ? (
                paginatedOrders.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    onUpdate={handleUpdateDelivery}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
