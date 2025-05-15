import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Card, Alert, Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { useParams, useHistory } from "react-router-dom";
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const { id } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.getUsers();
        const userData = data.find(u => u.id === parseInt(id));
        if (userData) {
          setUser(userData);
          setError(null);
        } else {
          setError('User not found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.message || 'Failed to fetch user details');
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await apiService.deleteUser(id);
      history.push(Routes.User.path);
    } catch (error) {
      setError(error.message || 'Failed to delete user');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Users</Breadcrumb.Item>
            <Breadcrumb.Item active>User Details</Breadcrumb.Item>
          </Breadcrumb>
          <h4>User Details</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => history.push(`${Routes.UserEdit.path.replace(':id', id)}`)}
          >
            Edit User
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete User
          </Button>
        </div>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">User Information</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Name</h6>
                  <p>{user.name}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Username</h6>
                  <p>{user.username}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Role</h6>
                  <p>{user.role.name}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Additional Information</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>ID</h6>
                  <p>{user.id}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Status</h6>
                  <p>{user.status || 'Active'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};