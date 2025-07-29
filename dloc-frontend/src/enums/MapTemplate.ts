export enum MapTemplate {
  default = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

  cartodb = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  cycle = 'http://{s}.tile.openstreetmap.com/cycle/{z}/{x}/{y}.png',
  ESRI = 'http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  landscape = 'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png',
  oms = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  standard = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
}
