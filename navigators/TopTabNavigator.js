import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ImageScreen from '../screens/ImageScreen';
import VideoScreen from '../screens/VideoScreen';
const Tab = createMaterialTopTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                style: { backgroundColor: 'black' },
                activeTintColor: 'white'
            }}>
            <Tab.Screen name="Videos" component={VideoScreen} />
            <Tab.Screen name="Images" component={ImageScreen} />
        </Tab.Navigator>
    );
}

export default MyTabs;
