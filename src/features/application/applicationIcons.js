// Original Folkkit outline symbols. Shared geometry for SVG preview and PDF.
const poly=(...points)=>points.slice(1).map((p,i)=>[...points[i],...p])
const circle=(x,y,r)=>poly(...Array.from({length:25},(_,i)=>[x+r*Math.cos(i*Math.PI/12),y+r*Math.sin(i*Math.PI/12)]))
const box=poly([4,5],[20,5],[20,19],[4,19],[4,5])
const paths={
 email:[...box,...poly([4,6],[12,13],[20,6])],
 phone:poly([5,3],[9,3],[11,8],[8,10],[14,16],[16,13],[21,15],[21,19],[18,21],[12,18],[6,12],[3,6],[5,3]),
 address:[...circle(12,9,5),...poly([7,12],[12,21],[17,12]),...circle(12,9,1.5)],
 website:[...circle(12,12,9),...poly([3,12],[21,12]),...poly([12,3],[8,8],[8,16],[12,21],[16,16],[16,8],[12,3])],
 linkedin:[...box,...poly([8,10],[8,16]),...poly([12,16],[12,10],[16,10],[17,12],[17,16]),...circle(8,8,0.7)],
 instagram:[...box,...circle(12,12,4),...circle(17,8,0.8)],
 citizenship:[...poly([5,21],[5,3],[19,3],[17,8],[19,13],[5,13])],
 profile:[...circle(12,7,4),...poly([4,21],[5,16],[9,13],[15,13],[19,16],[20,21])],
 experience:[...box,...poly([9,5],[9,2],[15,2],[15,5]),...poly([4,11],[20,11]),...poly([10,11],[10,14],[14,14],[14,11])],
 education:[...poly([2,9],[12,4],[22,9],[12,14],[2,9]),...poly([6,11],[6,17],[12,20],[18,17],[18,11]),...poly([22,9],[22,18])],
 skills:[...poly([9,6],[3,12],[9,18]),...poly([15,6],[21,12],[15,18]),...poly([14,4],[10,20])],
 languages:[...box,...poly([7,9],[11,9],[9,15],[7,12],[12,15]),...poly([14,15],[17,9],[20,15]),...poly([15,13],[19,13])],
 projects:[...poly([3,6],[10,6],[12,9],[21,9],[21,20],[3,20],[3,6])],
 engagement:[...poly([12,21],[3,12],[3,7],[7,4],[12,8],[17,4],[21,7],[21,12],[12,21])],
 custom:[...box,...poly([8,10],[16,10]),...poly([8,14],[14,14])],
}
export function applicationIconSegments(name){return paths[name]||paths.custom}
