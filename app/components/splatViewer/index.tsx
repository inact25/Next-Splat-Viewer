import React from "react";
import {Float, Splat} from "@react-three/drei";
import {Euler, Vector3} from "@react-three/fiber";

type Props = {
    src: string
    scale?: number
    position?: Vector3
    rotation?: Euler | undefined
    isFloating?: boolean
}
const Index: React.FC<Props> = ({src, scale = 3, position = [0, 0, 0], rotation = [0,0,0], isFloating = false}) => {
    return (
        <>
            <ambientLight intensity={0.3}/>
            {isFloating ?
                <Float>
                    <Splat
                        scale={scale}
                        position={position}
                        rotation={rotation}
                        src={src ?? ''}
                    />
                </Float>
                :
                <Splat
                    scale={3}
                    position={[0, 0, 0]}
                    // rotation={[0, 0, 0]}
                    src={src ?? ''}
                />
            }
        </>
    );
};

export default Index;