import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Card, Table, Alert, Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await apiService.getCompanies();
      setCompanies(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError(error.message || 'Failed to fetch companies');
    }
  };

  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCompany) return;

    setDeleteLoading(true);
    try {
      await apiService.deleteCompany(selectedCompany.id);
      setShowDeleteModal(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      setError(error.message || 'Failed to delete company');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Company</Breadcrumb.Item>
            <Breadcrumb.Item active>Companies</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Companies</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button as={Link} to={Routes.CompanyNew.path} variant="primary" size="sm">
            <FontAwesomeIcon icon={faEdit} className="me-2" /> New Company
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">Name</th>
                <th className="border-bottom">Address</th>
                <th className="border-bottom">Phone</th>
                <th className="border-bottom">Email</th>
                <th className="border-bottom">Website</th>
                <th className="border-bottom">Tax Code</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id}>
                  <td>
                    <Link to={`${Routes.CompanyDetail.path.replace(':id', company.id)}`}>
                      {company.name}
                    </Link>
                  </td>
                  <td>{company.address}</td>
                  <td>{company.phone}</td>
                  <td>{company.email}</td>
                  <td>{company.website}</td>
                  <td>{company.taxCode}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`${Routes.CompanyEdit.path.replace(':id', company.id)}`}
                      variant="info"
                      size="sm"
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(company)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

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