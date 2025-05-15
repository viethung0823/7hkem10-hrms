import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog, faHome, faSearch, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown, Alert, Table, Modal } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default (props) => {
  const { title = "Role Management", showSearch = true, showSettings = true } = props;
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const fetchRoles = async () => {
    try {
      const data = await apiService.getRoles();
      console.log('API Response:', data);
      setRoles(data);
      setFilteredRoles(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError(error.message || 'Failed to fetch roles');
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === '') {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter(role =>
        role.name.toLowerCase().includes(searchValue)
      );
      setFilteredRoles(filtered);
    }
  };

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;

    setLoading(true);
    try {
      await apiService.deleteRole(roleToDelete.id);
      setSuccess('Role deleted successfully!');
      // Refresh the roles list
      await fetchRoles();
    } catch (error) {
      setError(error.message || 'Failed to delete role');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setRoleToDelete(null);
    }
  };

  const isAdminRole = (roleId) => roleId === 10000;

  return (
    <>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-3">
          {success}
        </Alert>
      )}

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item active>Roles</Breadcrumb.Item>
          </Breadcrumb>
          <h4>{title}</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          {showSettings && (
            <ButtonGroup>
              <Button
                variant="primary"
                size="sm"
                onClick={() => history.push(Routes.RoleNew.path)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                New Role
              </Button>
            </ButtonGroup>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="table-settings mb-4">
          <Row className="justify-content-between align-items-center">
            <Col xs={8} md={6} lg={3} xl={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>
            {/* <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-0">
                  <span className="icon icon-sm icon-gray">
                    <FontAwesomeIcon icon={faCog} />
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-right">
                  <Dropdown.Item className="fw-bold text-dark">Show</Dropdown.Item>
                  <Dropdown.Item className="d-flex fw-bold">
                    10 <span className="icon icon-small ms-auto"><FontAwesomeIcon icon={faCheck} /></span>
                  </Dropdown.Item>
                  <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                  <Dropdown.Item className="fw-bold">30</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col> */}
          </Row>
        </div>
      )}

      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map(role => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => history.push(`${Routes.RoleEdit.path.replace(':id', role.id)}`)}
                >
                  Edit
                </Button>
                {!isAdminRole(role.id) && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(role)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the role "{roleToDelete?.name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};