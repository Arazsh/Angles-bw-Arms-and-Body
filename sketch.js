//@author Araz
//Date: Jan 30, 2021


let video;
let poseNet;
let poses = [];


function setup() {
//creating a canvas in the browser compatible to webcam resolution (change it to desired values)
	createCanvas(1200, 980);
  	video = createCapture(VIDEO);
  	video.size(width, height);
//creating PoseNet using ml5
	poseNet = ml5.poseNet(video, modelReady);
//listen to "pose" events
	poseNet.on('pose', (results) => {
	poses = results;
	});
//only showing the canvas
  	video.hide();
}


function modelReady() {
  console.log("Model is ready!");
}


function draw() {
image(video, 0, 0, width, height);

//denoting the 17 keypoints on the body by green circles
for (let i = 0; i < poses.length; i++) {
    //loop over the keypoints of each pose
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      //draw the circle on the keypoint's location if the confidence of detection is greater than 0.3
      if (keypoint.score > 0.3) {
        noFill(0, 255, 0);
        ellipse(keypoint.position.x, keypoint.position.y, 15, 15);
      }
    }
  }


  //finding the angle between left and right arms with the body
  for (let i = 0; i < poses.length; i++) {
    //loop over the keypoints of each pose
    let pose = poses[i].pose;

    if(pose.leftElbow.confidence>.5 && pose.leftShoulder.confidence>.5 && pose.leftHip.confidence>.5){
//the locations of left elbow, shoulder, and hip, which form a triangle
    var le = {x:pose.leftElbow.x, y:pose.leftElbow.y};
    fill(255,0,0);
    ellipse(le.x, le.y, 15, 15);
    var ls = {x:pose.leftShoulder.x, y:pose.leftShoulder.y};
    ellipse(ls.x, ls.y, 15, 15);
    var lh = {x:pose.leftHip.x, y:pose.leftHip.y};
    ellipse(lh.x, lh.y, 15, 15);
//the sides of the triangle
    var lsTole = Math.sqrt(Math.pow((ls.x - le.x),2) + Math.pow((ls.y - le.y),2));
    var lsTolh = Math.sqrt(Math.pow((ls.x - lh.x),2) + Math.pow((ls.y - lh.y),2));
    var leTolh = Math.sqrt(Math.pow((le.x - lh.x),2) + Math.pow((le.y - lh.y),2));
//angle between left arm and bodey
    var res1Degree = Math.acos(((Math.pow(lsTole, 2)) + (Math.pow(lsTolh, 2)) - (Math.pow(leTolh, 2))) / (2 * lsTole * lsTolh)) * 180 / Math.PI;
    if (res1Degree){
    textSize(20);
    text('Angle bw Left arm & body = '+(Math.round(res1Degree)).toString(),10, 400);}
  }

  if(pose.leftElbow.confidence>.5 && pose.leftShoulder.confidence>.5 && pose.leftHip.confidence>.5){
//the locations of right elbow, shoulder, and hip, which form a triangle
    var re = {x:pose.rightElbow.x, y:pose.rightElbow.y};
    fill(0,255,255);
    ellipse(re.x, re.y, 15, 15);
    var rs = {x:pose.rightShoulder.x, y:pose.rightShoulder.y};
    ellipse(rs.x, rs.y, 15, 15);
    var rh = {x:pose.rightHip.x, y:pose.rightHip.y};
    ellipse(rh.x, rh.y, 15, 15);
//the sides of the triangle
    var rsTore = Math.sqrt(Math.pow((rs.x - re.x),2) + Math.pow((rs.y - re.y),2));
    var rsTorh = Math.sqrt(Math.pow((rs.x - rh.x),2) + Math.pow((rs.y - rh.y),2));
    var reTorh = Math.sqrt(Math.pow((re.x - rh.x),2) + Math.pow((re.y - rh.y),2));
//angle between right arm and bodey
    var res2Degree = Math.acos(((Math.pow(rsTore, 2)) + (Math.pow(rsTorh, 2)) - (Math.pow(reTorh, 2))) / (2 * rsTore * rsTorh)) * 180 / Math.PI;
    if (res2Degree){
    textSize(20);
    text('Angle bw Right arm & body = '+(Math.round(res2Degree)).toString(),10, 430);}
  }
}


//drawing the skeleton
for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    //loop over the connections of the skeletons
    for (let j = 0; j < skeleton.length; j++) {
      let a = skeleton[j][0];
      let b = skeleton[j][1];
      strokeWeight(3);
      stroke(0,0,255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }

}
