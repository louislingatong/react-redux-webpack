import React, {useEffect, useState} from 'react';
import {Alert, Card, Col, Container, Row} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import ProfileForm from './forms/ProfileForm';
import Avatar from '../../components/avatar/Avatar';
import {update, updateAvatar} from '../../services/profileService';
import {loggedInUser} from '../../store/authSlice';
import {loaderStatus} from '../../store/loaderSlice';

function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector(loggedInUser);
  const isLoading = useSelector(loaderStatus);
  const [error, setError] = useState({});
  const [alertMessage, setAlertMessage] = useState({});
  const [successProfileUpdate, setSuccessProfileUpdate] = useState(false);

  const handleSubmitForm = data => {
    dispatch(update(data))
      .then(() => setSuccessProfileUpdate(true))
      .catch(err => {
        if (err.status === 422) {
          setError(err.error);
        } else {
          setAlertMessage({
            type: 'danger',
            message: err.error
          });
        }
      })
      .finally(() => setSuccessProfileUpdate(false));
  }

  const handleAvatarUpdate = avatar => {
    dispatch(updateAvatar(avatar));
  }

  const handleCloseAlertMessage = () => {
    setAlertMessage({});
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>Profile</h3>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={4}>
          <Card>
            <Card.Body className="text-center">
              {
                !_.isEmpty(alertMessage) &&
                <Alert variant={alertMessage.type} onClose={handleCloseAlertMessage} dismissible>
                  {alertMessage.message}
                </Alert>
              }
              <Avatar handleAvatarUpdate={handleAvatarUpdate} avatarPath={profile.avatar && profile.avatar.path} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8}>
          <Card>
            <Card.Body>
              <ProfileForm handleSubmitForm={handleSubmitForm} error={error} isLoading={isLoading}
                           profile={profile} successProfileUpdate={successProfileUpdate}/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile;