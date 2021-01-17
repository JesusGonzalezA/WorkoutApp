
export const getAnglesFromPose = ( { keypoints } ) => {

    return [
        find_angle_aux( keypoints, 5, 9, 7),     // Left wrist, elbow, shoulder
        find_angle_aux( keypoints, 6, 10, 8),    // Right wrist, elbow, shoulder
        find_angle_aux( keypoints, 7, 11, 5),    // Left elbow, shoulder, hip
        find_angle_aux( keypoints, 8, 12, 6),    // Right elbow, shoulder, hip
        find_angle_aux( keypoints, 5, 13, 11),   // Left shoulder, hip, knee
        find_angle_aux( keypoints, 6, 14, 12),   // Right shoulder, hip, knee
        find_angle_aux( keypoints, 11, 15, 13),  // Left hip, knee, ankle
        find_angle_aux( keypoints, 12, 16, 14),  // Right hip, knee, ankle
    ]
}

const find_angle_aux = ( keypoints, index_p0, index_p1, index_c) => {

    const pos_p0 = keypoints[index_p0].position;
    const pos_p1 = keypoints[index_p1].position;
    const pos_c  = keypoints[index_c].position;

    const accuracy_p0 = keypoints[index_p0].score;
    const accuracy_p1 = keypoints[index_p1].score;
    const accuracy_c  = keypoints[index_c].score;

    return {
        angle: find_angle(pos_p0, pos_p1, pos_c),
        min_accuracy: Math.min( accuracy_p0, accuracy_p1, accuracy_c)
    }
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
