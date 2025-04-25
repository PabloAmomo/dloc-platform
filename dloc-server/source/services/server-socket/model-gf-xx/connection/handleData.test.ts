import assert from 'node:assert';
import test from 'node:test';
import { mySqlPersistence } from '../../../../infraestucture/mySql/mySqlPersistence';
import handleData from './handleData';
import { handlePacket } from '../handlePacket';

const persistence = new mySqlPersistence();

test('Simulate command [TRVYP16]', async () => {
  const imei = '869207032612724';
  const remoteAdd = '127.0.0.1';
  const data = 'TRVYP16,10000002300010120000204000099992#';

  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.equal(data.startsWith('TRVZP16'), true);
      },
      destroy: () => {
        assert.ok(false, 'connection closed');
      },
    },
  }).then((results) => {
    assert.equal(results.length, 1);
    assert.equal(results[0].response.startsWith('TRVZP16'), true);
    assert.equal(results[0].response.endsWith('#'), true);
  });
});

test('Simulate command [TRVYP02]', async () => {
  const imei = '869207032612724';
  const remoteAdd = '127.0.0.1';
  const data = 'TRVYP02,214042006963593,8934041422092533560F#';

  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.equal(data.startsWith('TRVZP02'), true);
      },
      destroy: () => {
        assert.ok(false, 'connection closed');
      },
    },
  }).then((results) => {
    assert.equal(results.length, 1);
    assert.equal(results[0].response.startsWith('TRVZP02'), true);
    assert.equal(results[0].response.endsWith('#'), true);
  });
});

test('Simulate command [TRVAP89]', async () => {
  const imei = '869207032612724';
  const remoteAdd = '127.0.0.1';
  const data = 'TRVAP89,000001,1,0#';

  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.equal(data.startsWith('TRVBP89'), true);
      },
      destroy: () => {
        assert.ok(false, 'connection closed');
      },
    },
  }).then((results) => {
    assert.equal(results.length, 1);
    assert.equal(results[0].response.startsWith('TRVBP89'), true);
    assert.equal(results[0].response.endsWith('#'), true);
  });
});

test('Simulate command [TRVAP14] (ERROR)', async () => {
  const imei = '869207032612724';
  const remoteAdd = '127.0.0.1';
  const data = 'TRVYP14240128A3951.0473N00307.1110E004.6141347056.3004100906600#';
  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.equal(data.startsWith('TRVZP14'), true);
      },
      destroy: () => {
        assert.ok(false, 'connection closed');
      },
    },
  }).then((results) => {
    assert.equal(results.length, 1);
    assert.equal(results[0].response.startsWith('TRVZP14'), true);
    assert.equal(results[0].response.endsWith('#'), true);
  });
});

test('Simulate command [TRVAP14]', async () => {
  const imei = '869207032612724';
  const remoteAdd = '127.0.0.1';
  const data = 'TRVAP14,214,03,6103,4445#';

  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.equal(data.startsWith('TRVBP14'), true);
      },
      destroy: () => {
        assert.ok(false, 'connection closed');
      },
    },
  }).then((results) => {
    assert.equal(results.length, 1);
    assert.equal(results[0].response.startsWith('TRVBP14'), true);
    assert.equal(results[0].response.endsWith('#'), true);
  });
});

test('Simulate command [TRVYP14] (TWO PACKETS VALID DATA AND INVALID DATA)', async () => {
  const imei = '869207032612724';
  const remoteAdd = '127.0.0.1';
  const data = 'TRVYP14231229A3933.7865N00241.3590E070.8160722109.470830120000000100004,214,03,6100,3626#TRVYP14040101V0000.0000N00000.0000E000.0001228000.001000000040000200004,214,03,6103,4444#';

  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.equal(data.startsWith('TRVZP14'), true);
      },
      destroy: () => {
        assert.ok(false, 'connection closed');
      },
    },
  }).then((results) => {
    assert.equal(results.length, 2);
    assert.equal(results[0].response.startsWith('TRVZP14'), true);
    assert.equal(results[0].response.endsWith('#'), true);
    assert.equal(results[1].response.startsWith('TRVZP14'), true);
    assert.equal(results[1].response.endsWith('#'), true);
  });
});

test('Simulate command [TRVYP14] (VALID DATA)', async () => {
  const imei = '869207032612724';
  const remoteAdd = '127.0.0.1';
  const data = 'TRVYP14231229A3933.7865N00241.3590E070.8160722109.470830120000000100004,214,03,6100,3626#';

  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.equal(data.startsWith('TRVZP14'), true);
      },
      destroy: () => {
        assert.ok(false, 'connection closed');
      },
    },
  }).then((results) => {
    assert.equal(results.length, 1);
    assert.equal(results[0].response.startsWith('TRVZP14'), true);
    assert.equal(results[0].response.endsWith('#'), true);
  });
});

test('Simulate command [TRVYP14] (INVALID DATA)', async () => {
  const imei = '869207032612724';
  const remoteAdd = '127.0.0.1';
  const data = 'TRVYP14040101V0000.0000N00000.0000E000.0001228000.001000000040000200004,214,03,6103,4444#';

  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.equal(data.startsWith('TRVZP14'), true);
      },
      destroy: () => {
        assert.ok(false, 'connection closed');
      },
    },
  }).then((results) => {
    assert.equal(results.length, 1);
    assert.equal(results[0].response.startsWith('TRVZP14'), true);
    assert.equal(results[0].response.endsWith('#'), true);
  });
});

test('Simulate command [INVALID] - Check discard', async () => {
  const imei = '';
  const remoteAdd = '127.0.0.1';
  const data = 'INVALID-PACKET';

  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.ok(false, 'connection closed');
      },
      destroy: () => {},
    },
  }).then((results: any) => {
    assert.equal(results.length, 1);
    assert.equal(results[0].imei, '');
    assert.equal(results[0].error, '');
  });
});

test('Simulate command [TRVAP00] - start connection', async () => {
  const imei = '';
  const remoteAdd = '127.0.0.1';
  const data = 'TRVAP00869207032612724#';

  await handleData({
    imei,
    remoteAdd,
    data,
    handlePacket,
    persistence,
    conn: {
      write: (data: string) => {
        assert.equal(data.startsWith('TRVBP0020'), true);
      },
      destroy: () => {
        assert.ok(false, 'connection closed');
      },
    },
  }).then((results) => {
    assert.equal(results.length, 1);
    assert.equal(results[0].response.startsWith('TRVBP00'), true);
    assert.equal(results[0].response.endsWith('#'), true);
    assert.equal(results[0].response.length, 22);
    assert.equal(results[0].imei, '869207032612724');
  });
});
