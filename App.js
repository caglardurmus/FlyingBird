import React, {useState, useRef, useEffect} from 'react';
import Matter from 'matter-js';
import {GameEngine} from 'react-native-game-engine';
import {
    StyleSheet,
    View,
    Image,
    Text,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import Constants from './src/constants/GameConstants';
import {Floor} from './src/components/Floor';
import {Bird} from './src/components/Bird';
import Images from './src/components/Images';
import Physics, {resetPipeCount} from './src/components/Physics';
import {Background} from './src/components/Background';
import {StartImage} from './src/components/StartImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MAX_SCORE} from './src/constants/AsyncStoreConstants';

const App: () => Node = () => {
    const [pause, setPause] = useState(true);
    const [score, setScore] = useState(0);
    const [running, setRunning] = useState(true);
    const [maxScore, setMaxScore] = useState(null);

    useEffect(() => {
        getMaxScore();
    }, []);


    const getMaxScore = async () => {
        AsyncStorage.getItem(MAX_SCORE)
            .then(x => {
                if (x) {
                    setMaxScore(parseInt(x));
                }
            })
            .catch(e => console.error(e));
    };

    let gameEngine = useRef();
    const entities = setupWorld();

    const onEvent = (e) => {
        switch (e.type) {
            case 'game-over':
                checkAndSetMaxScore();
                setRunning(false);
                break;
            case 'score':
                setScore(x => x + 1);
                break;
            case 'start-end':
                setPause(false);
                break;
        }
    };

    const checkAndSetMaxScore = async () => {
        const maxScore = await AsyncStorage.getItem(MAX_SCORE);
        if ((maxScore && score > parseInt(maxScore)) || !maxScore) {
            AsyncStorage.setItem(MAX_SCORE, score.toString());
            setMaxScore(score);
        }
    };

    const reset = () => {
        resetPipeCount();
        gameEngine.current.swap(setupWorld());
        setScore(0);
        setPause(true);
        setRunning(true);
    };

    function setupWorld() {
        let engine = Matter.Engine.create({enableSleeping: false});
        let world = engine.world;
        world.gravity.y = 0.0;

        let bird = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 2,
            Constants.MAX_HEIGHT / 2,
            Constants.BIRD_WIDTH,
            Constants.BIRD_HEIGHT);

        let floor1 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 2,
            Constants.MAX_HEIGHT - 25,
            Constants.MAX_WIDTH + 4,
            50,
            {isStatic: true},
        );
        let floor2 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
            Constants.MAX_HEIGHT - 25,
            Constants.MAX_WIDTH + 4,
            50,
            {isStatic: true},
        );

        let background1 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 2,
            Constants.MAX_HEIGHT / 2,
            Constants.MAX_WIDTH + 4,
            Constants.MAX_HEIGHT,
            {isStatic: true},
        );

        let background2 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
            Constants.MAX_HEIGHT / 2,
            Constants.MAX_WIDTH + 4,
            Constants.MAX_HEIGHT,
            {isStatic: true},
        );

        let startImage = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH,
            Constants.MAX_HEIGHT,
            Constants.MAX_WIDTH,
            Constants.MAX_HEIGHT,
            {isStatic: true},
        );

        Matter.World.add(world, [bird, floor1, floor2]);
        Matter.Events.on(engine, 'collisionStart', (event) => {
            let pairs = event.pairs;

            gameEngine.current.dispatch({type: 'game-over'});
        });

        return {
            physics: {engine: engine, world: world},
            background1: {body: background1, renderer: Background},
            background2: {body: background2, renderer: Background},
            startImage: {body: startImage, renderer: StartImage},
            floor1: {body: floor1, renderer: Floor},
            floor2: {body: floor2, renderer: Floor},
            bird: {body: bird, pose: 1, renderer: Bird},
        };
    };

    return (
        <View style={styles.container}>
            <GameEngine
                ref={gameEngine}
                style={styles.gameContainer}
                systems={[Physics]}
                running={running}
                onEvent={onEvent}
                entities={entities}
            >
                <StatusBar hidden={true}/>
            </GameEngine>
            {!running &&
            <View style={styles.fullScreen}>
                <Text style={styles.scoreGameOver}>Score: {score}</Text>
                <Image source={Images.gameOver}
                       style={styles.gameOverImg}
                       resizeMode="contain"
                />
                <TouchableOpacity
                    style={{
                        marginTop: 30,
                    }}
                    onPress={reset}>
                    <Image source={Images.replay}
                           style={styles.replay}
                           resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>}
            {pause && running && maxScore > 0 &&
            <Text style={{
                ...styles.scoreGameOver,
                fontSize: 36,
                top: 100,
                position: 'absolute',
                alignSelf: 'center',
            }}>Max Score: {maxScore}</Text>}
            {!pause && running && <Text style={styles.score}>{score}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        position: 'absolute',
        width: Constants.MAX_WIDTH - 40,
        height: Constants.MAX_HEIGHT - 40,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    replay: {
        width: 50,
        height: 50,
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    gameOverImg: {
        width: Constants.MAX_WIDTH - 40,
        height: 100,
    },
    score: {
        color: 'white',
        fontSize: 72,
        fontFamily: '04b_19',
        position: 'absolute',
        top: 50,
        left: Constants.MAX_WIDTH / 2 - 24,
        textShadowColor: '#222222',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 2,
    },
    scoreGameOver: {
        fontFamily: '04b_19',
        color: 'white',
        fontSize: 72,
        textShadowColor: '#222222',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 2,
    },
});

export default App;
