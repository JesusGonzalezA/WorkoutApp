
export const getAnglesFromPose = ( { keypoints } ) => {
    
    return [
        find_angle(keypoints[5].position, keypoints[9].position, keypoints[7].position),    // Left wrist, elbow, shoulder
        find_angle(keypoints[6].position, keypoints[10].position, keypoints[8].position),   // Right wrist, elbow, shoulder
        find_angle(keypoints[7].position, keypoints[11].position, keypoints[5].position),    // Left elbow, shoulder, hip
        find_angle(keypoints[8].position, keypoints[12].position, keypoints[6].position),    // Right elbow, shoulder, hip
        find_angle(keypoints[5].position, keypoints[13].position, keypoints[11].position),    // Left shoulder, hip, knee
        find_angle(keypoints[6].position, keypoints[14].position, keypoints[12].position),    // Right shoulder, hip, knee
        find_angle(keypoints[11].position, keypoints[15].position, keypoints[13].position),    // Left hip, knee, ankle
        find_angle(keypoints[12].position, keypoints[16].position, keypoints[14].position)    // Right hip, knee, ankle
    ]
}

/**
 * Calculates the angle between two vectors pointing outward from one center
 *
 * @param p0 first point
 * @param p1 second point
 * @param c center point
 */
const find_angle = (p0,p1,c) => {
    const p0c  = Math.sqrt( Math.pow(c.x-p0.x,2) + Math.pow(c.y-p0.y,2) );
    const p1c  = Math.sqrt( Math.pow(c.x-p1.x,2) + Math.pow(c.y-p1.y,2) );
    const p0p1 = Math.sqrt( Math.pow(p1.x-p0.x,2)+ Math.pow(p1.y-p0.y,2) );
    const angleRadians =  Math.acos( (p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c) );

    return (angleRadians*180)/Math.PI;
}
