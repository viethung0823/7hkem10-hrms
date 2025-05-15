import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Card, Table, Alert, Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchDepartments();
    // Load companies from localStorage
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await apiService.getDepartments();
      setDepartments(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError(error.message || 'Failed to fetch departments');
    }
  };

  const handleDeleteClick = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;

    setDeleteLoading(true);
    try {
      await apiService.deleteDepartment(selectedDepartment.id);
      setShowDeleteModal(false);
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      setError(error.message || 'Failed to delete department');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getParentDepartmentName = (parentId) => {
    if (!parentId) return 'None';
    const parentDepartment = departments.find(dept => dept.id === parentId);
    return parentDepartment ? parentDepartment.name : 'Unknown';
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(comp => comp.id === companyId);
    return company ? company.name : 'Unknown';
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Company</Breadcrumb.Item>
            <Breadcrumb.Item active>Departments</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Departments</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button as={Link} to={Routes.DepartmentNew.path} variant="primary" size="sm">
            <FontAwesomeIcon icon={faEdit} className="me-2" /> New Department
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
                <th className="border-bottom">Company</th>
                <th className="border-bottom">Parent Department</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(department => (
                <tr key={department.id}>
                  <td>
                    <Link to={`${Routes.DepartmentDetail.path.replace(':id', department.id)}`}>
                      {department.name}
                    </Link>
                  </td>
                  <td>{getCompanyName(department.company)}</td>
                  <td>{getParentDepartmentName(department.parent)}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`${Routes.DepartmentEdit.path.replace(':id', department.id)}`}
                      variant="info"
                      size="sm"
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(department)}
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
          Are you sure you want to delete this department?
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