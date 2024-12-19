import React, { useEffect, useState } from 'react';

const BEACON_URL = 'https://validatorqueue.overnative.com/over/v1/beacon/states/head/deposit_estimation';

function ValidatorActivationCountdown() {
  const [expectedActivationEpoch, setExpectedActivationEpoch] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const genesisTime = new Date('2024-12-07T00:00:00Z').getTime();
  const epochLengthSeconds = 6.4 * 60;

  useEffect(() => {
    async function fetchEpochData() {
      const response = await fetch(BEACON_URL);
      console.log(response);

      const result = await response.json();
      const { expected_activation_epoch } = result.data;
      setExpectedActivationEpoch(expected_activation_epoch);
    }
    fetchEpochData();
  }, []);

  useEffect(() => {
    if (expectedActivationEpoch === null) return;

    const calculateTimeRemaining = () => {
      const now = Date.now();
      const activationTime = genesisTime + (expectedActivationEpoch * epochLengthSeconds * 1000);
      const diff = activationTime - now;

      if (diff <= 0) {
        setTimeRemaining('Already activated or activating very soon.');
        return;
      }

      const seconds = Math.floor(diff / 1000);
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${secs}s`);
    };

    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [expectedActivationEpoch]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      fontFamily: "'Roboto', sans-serif",
      color: '#fff'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ marginBottom: '16px', fontWeight: 600, fontSize: '24px' }}>Validator Activation</h1>
        <p style={{ marginBottom: '32px', fontSize: '16px', lineHeight: '1.5' }}>
          If you stake now, your validator will be activated in:
        </p>

        {timeRemaining ? (
          <div style={{ fontSize: '28px', fontWeight: '700' }}>
            {timeRemaining}
          </div>
        ) : (
          <div style={{ fontSize: '20px' }}>Calculating...</div>
        )}
      </div>
    </div>
  );
}

export default ValidatorActivationCountdown;
