import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Row, Col, Alert, Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { Link, useParams, useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const { id } = useParams();
  const history = useHistory();
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany, id]);

  const fetchCompany = async () => {
    try {
      const data = await apiService.getCompany(id);
      setCompany(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching company:', error);
      setError(error.message || 'Failed to fetch company details');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await apiService.deleteCompany(id);
      setShowDeleteModal(false);
      history.push('/companies');
    } catch (error) {
      console.error('Error deleting company:', error);
      setError(error.message || 'Failed to delete company');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!company && !error) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Company</Breadcrumb.Item>
            <Breadcrumb.Item>Companies</Breadcrumb.Item>
            <Breadcrumb.Item active>Company Details</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Company Details</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button
            as={Link}
            to={`${Routes.CompanyEdit.path.replace(':id', id)}`}
            variant="primary"
            size="sm"
            className="me-2"
          >
            <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteClick}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {company && (
        <Card border="light" className="bg-white shadow-sm">
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5 className="mb-3">Basic Information</h5>
                <div className="mb-3">
                  <strong>Name:</strong> {company.name}
                </div>
                <div className="mb-3">
                  <strong>Address:</strong> {company.address}
                </div>
                <div className="mb-3">
                  <strong>Phone:</strong> {company.phone}
                </div>
              </Col>
              <Col md={6}>
                <h5 className="mb-3">Additional Information</h5>
                <div className="mb-3">
                  <strong>Email:</strong> {company.email}
                </div>
                <div className="mb-3">
                  <strong>Website:</strong> {company.website}
                </div>
                <div className="mb-3">
                  <strong>Tax Code:</strong> {company.taxCode}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this company?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};