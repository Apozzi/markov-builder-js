import { Vertex } from "../interfaces/Vertex";

let springForce = 1;
let idealDistance = 3;
let strengthOfRepulsiveForce = 2;


export default class AlgorithmsUtils {

    static normalizedVector(v: Vertex, u: Vertex) {
        const vector = {
            x: u.x - v.x,
            y: u.y - v.y
        };
        const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (magnitude === 0) return { x: 0, y: 0 };
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude
        };
    }

    static euclideanDistanceFast(u: Vertex, v: Vertex) {
        return (u.x - v.x)**2 + (u.y - v.y)**2;
        
    }

    static euclideanDistance(u: Vertex, v: Vertex) {
        return Math.sqrt(this.euclideanDistanceFast(u, v));
        
    }

    static calculateRepulsiveForce(u: Vertex, v: Vertex) {
        let normalizedVectorUToV = this.normalizedVector(u, v);
        let force = strengthOfRepulsiveForce/this.euclideanDistanceFast(u,v);
        return {
            x: normalizedVectorUToV.x * force,
            y: normalizedVectorUToV.y * force
        }
     }
  
     static calculateAttractiveForce(u: Vertex, v: Vertex) {
        let normalizedVectorVToU = this.normalizedVector(v, u);
        let force =  springForce * Math.log(this.euclideanDistance(u,v)/idealDistance);
        return {
            x: normalizedVectorVToU.x * force,
            y: normalizedVectorVToU.y * force
        }
     }
}