import * as React from 'react';
import {View, Image} from 'react-native';
import Images from './Images';

type Props = {
    body: any,
    pose: string
};

export const Bird = (props: Props) => {
    const {body, pose} = props;
    const width = body.bounds.max.x - body.bounds.min.x;
    const height = body.bounds.max.y - body.bounds.min.y;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    let image = Images['bird' + pose];

    return (
        <Image
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
            }}
            resizeMode="stretch"
            source={image}/>
    );
};

export default Bird;

Bird.defaultProps = {
    pose: '1',
};

