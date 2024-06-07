import React from "react";
import {Float, Splat} from "@react-three/drei";

type Props = {
    src: string
}
const Index: React.FC<Props> = ({src}) => {
    return (
        <>
            <ambientLight intensity={0.3}/>
            <Float>
                <Splat
                    scale={2}
                    position={[4, 3, 1]}
                    rotation={[0, Math.PI / 2, 0]}
                    src={src ?? ''}
                />
            </Float>
        </>
    );
};

export default Index;