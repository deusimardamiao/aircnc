import React, { useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  AsyncStorage,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';

import socketio from 'socket.io-client';

import SpotList from './../components/SpotList';

import logo from './../assets/logo.png';

export default function List() {
  const [techs, setTechs] = useState([]);

  const user_id = AsyncStorage.getItem('user');
  const socket = useMemo(() => socketio('http://10.0.0.108:3333', {
    query: user_id,
  }), [user_id]);

  useEffect(() => {
    socket.on('booking_response', booking => {
      console.log(booking);
      Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}!`)
    });
  },[]);

  useEffect(() => {
    AsyncStorage.getItem('techs').then(storageTechs => {
      const techsArray = storageTechs.split(',').map(tech => tech.trim());
      
      setTechs(techsArray);
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />
      
      <ScrollView>
        {techs.map(tech => <SpotList key={tech} tech={tech} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
  },

  logo: {
    height: 32,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
  },
});
