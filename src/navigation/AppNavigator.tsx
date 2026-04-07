import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EventFeedScreen from '../screens/interface1/EventFeedScreen';
import EventMapScreen from '../screens/interface2/EventMapScreen';
import FriendAvailabilityScreen from '../screens/interface3/FriendAvailabilityScreen';
import MoodTrackerScreen from '../screens/interface4/MoodTrackerScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EventFeed" component={EventFeedScreen} />
      <Stack.Screen name="EventMap" component={EventMapScreen} />
      <Stack.Screen name="FriendAvailability" component={FriendAvailabilityScreen} />
      <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
    </Stack.Navigator>
  );
}
