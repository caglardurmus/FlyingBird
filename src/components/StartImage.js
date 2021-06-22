import React from 'react';
import Images from './Images';
import {Image, StyleSheet, View, Text} from 'react-native';
import Constants from '../constants/GameConstants';
export const StartImage = (props) => {
    return (
        <View>
            <Image source={Images.start}
                   style={styles.backgroundImage}
                   resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    score: {
        color: 'white',
        fontSize: 72,
        //fontFamily: '04b_19',
        position: 'absolute',
        top: 50,
        left: Constants.MAX_WIDTH / 2 - 24,
        textShadowColor: '#222222',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 2,
    },
    backgroundImage: {
        position: 'absolute',
        width: Constants.MAX_WIDTH - 40,
        height: Constants.MAX_HEIGHT - 40,
        alignSelf: 'center',
        justifyContent: 'center',
    },
});
