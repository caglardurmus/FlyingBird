import * as React from 'react';
import {View, Image} from 'react-native';
import Images from './Images';

type Props = {
    body: any
};
export const Pipe = (props: Props) => {
    const {body} = props;
    const width = body.bounds.max.x - body.bounds.min.x;
    const height = body.bounds.max.y - body.bounds.min.y;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    const pipeRatio = 160 / width; // 160 is the original image size
    const pipeHeight = 50 * pipeRatio;
    const pipeIterations = Math.ceil(height / pipeHeight);

    return (
        <View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                overflow: 'hidden',
                flexDirection: 'column',
            }}>
            {Array.apply(null, Array(pipeIterations)).map((el, idx) => {
                return <Image style={{width: width, height: pipeHeight}}
                              key={idx}
                              source={Images.pipeCore}
                              resizeMode="stretch"/>;
            })}
        </View>
    );
};

export default Pipe;
