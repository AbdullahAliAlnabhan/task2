// Install the required dependencies:
// npm install react-native-camera react-native-permissions

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import { request, PERMISSIONS } from 'react-native-permissions';

const App = () => {
  const [isCameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    // Request camera permission when the component mounts
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const permissionResult = await request(PERMISSIONS.ANDROID.CAMERA);
    if (permissionResult === 'granted') {
      console.log('Camera permission granted');
    } else {
      console.log('Camera permission denied');
    }
  };

  const takePicture = async (camera) => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      savePictureToGallery(data.uri);
      setCameraOpen(false);
    }
  };

  const savePictureToGallery = (imageUri) => {
    CameraRoll.save(imageUri, { type: 'photo' })
      .then(() => {
        console.log('Photo saved to gallery');
      })
      .catch((error) => {
        console.error('Error saving photo to gallery: ', error);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isCameraOpen ? (
        <RNCamera
          style={{ flex: 1, width: '100%' }}
          type={RNCamera.Constants.Type.back}
          autoFocus={RNCamera.Constants.AutoFocus.on}
        >
          {({ camera, status }) => {
            if (status !== 'READY') return <Text>Camera not ready</Text>;

            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
              >
                <TouchableOpacity
                  onPress={() => takePicture(camera)}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: '#fff',
                    marginBottom: 20,
                  }}
                />
              </View>
            );
          }}
        </RNCamera>
      ) : (
        <TouchableOpacity onPress={() => setCameraOpen(true)}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image
            style={{ width: 150, height: 150, borderRadius: 75 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default App;
