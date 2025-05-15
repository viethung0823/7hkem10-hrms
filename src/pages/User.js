import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Card, Table, Form, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiService.getUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        user.email?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Users</Breadcrumb.Item>
            <Breadcrumb.Item active>View All Users</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Users</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => history.push(Routes.UserNew.path)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            New User
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Form.Group className="mb-3 mt-3">
            <Form.Control
              type="text"
              placeholder="Search by name, username, or email..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>

          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">ID</th>
                <th className="border-bottom">Name</th>
                <th className="border-bottom">Username</th>
                <th className="border-bottom">Role</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.role.name}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => history.push(`/users/${user.id}`)}
                    >
                      <FontAwesomeIcon icon={faEye} className="me-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};