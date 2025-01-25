import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/waitingroom.css';

const WaitingRoom = ({ auth, setVwarToken, setVwarTokenExpiresIn }) => {
  const [position, setPosition] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [isFirstInQueue, setIsFirstInQueue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const enterQueue = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8084/assign_queue_number');
      const event_id = response.data.data.api_request_id;
      setEventId(event_id);

      // Retrieve queue position using the event ID
      const queueResponse = await axios.get(`http://localhost:8084/check_queue_number?request_id=${event_id}`);
      const queue_position = queueResponse.data.queue_number;
      if (queueResponse.data.token.access_token !== undefined) {
        setIsFirstInQueue(true);
        setVwarToken(queueResponse.data.token.access_token);
        setVwarTokenExpiresIn(queueResponse.data.token.expires_in);
      }else {
        setPosition(queue_position);
      }  
      const total_users = await axios.get('http://localhost:8084/waiting_num');
      setTotalUsers(total_users.data.waiting_number);
      setEstimatedTime(queue_position * 2); // Assuming each position takes 2 seconds
    } catch (error) {
      console.error('Error entering queue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventId !== null) {
      const interval = setInterval(async () => {
        try {
          const queueResponse = await axios.get(`http://localhost:8084/check_queue_number?request_id=${eventId}`);
          const total_users = await axios.get('http://localhost:8084/waiting_num');
          const queue_position = queueResponse.data.queue_number;
          
          setPosition(queue_position);
          setEstimatedTime(queue_position * 2); // Assuming each position takes 2 seconds
          setTotalUsers(total_users.data.waiting_number);
          
          if (queueResponse.data.token.access_token !== undefined) {
            setIsFirstInQueue(true);
            setVwarToken(queueResponse.data.token.access_token);
            setVwarTokenExpiresIn(queueResponse.data.token.expires_in);
            clearInterval(interval); // Stop the interval if a token is returned
          } else {
            const queue_position = queueResponse.data.queue_number;
            setPosition(queue_position);
            setEstimatedTime(queue_position * 2); // Assuming each position takes 2 seconds
            setTotalUsers(total_users.data.waiting_number);
          }
        } catch (error) {
          console.error('Error checking queue position:', error);
        }
      }, 10); // Wait for 10 seconds before making another request
      return () => clearInterval(interval);
    }
  }, [eventId]);

  const handleProceed = () => {
    navigate('/welcome');
  };

  return (
    <div className='waiting-room-div'>
      <h1>Waiting Room</h1>
      {eventId === null ? (
        <>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <button onClick={enterQueue}>Enter Queue</button>
          )}
        </>
      ) : (
        <>
          {isFirstInQueue ? (
            <p>You can now proceed from the queue.</p>
          ) : (
            <>
              <p>Your current position in the queue: {position}</p>
              <p>Total number of users in the queue: {totalUsers}</p>
              <p>Estimated time to leave the queue: {estimatedTime} seconds</p>
            </>
          )}
          <button onClick={handleProceed} disabled={!isFirstInQueue}>
            Proceed
          </button>
        </>
      )}
    </div>
  );
};

export default WaitingRoom;