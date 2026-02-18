# Planet Textures

This directory holds texture maps for the SOLARIS solar system explorer.

## Downloading Textures

The application uses 2K (2048x1024) equirectangular texture maps for each celestial body.
When textures are not available, the planet components fall back to solid colors derived
from each planet's accent color.

### Recommended Source: Solar System Scope

Free-to-use textures under Creative Commons Attribution 4.0:
https://www.solarsystemscope.com/textures/

Download the following files and place them in this directory:

| File Name           | Description                        | Source Name on Site            |
|---------------------|------------------------------------|-------------------------------|
| `sun.jpg`           | Sun surface texture                | 2k_sun.jpg                    |
| `mercury.jpg`       | Mercury surface texture            | 2k_mercury.jpg                |
| `venus.jpg`         | Venus surface/atmosphere texture   | 2k_venus_surface.jpg          |
| `earth.jpg`         | Earth day map                      | 2k_earth_daymap.jpg           |
| `earth-normal.jpg`  | Earth normal/bump map              | 2k_earth_normal_map.tif       |
| `mars.jpg`          | Mars surface texture               | 2k_mars.jpg                   |
| `jupiter.jpg`       | Jupiter surface texture            | 2k_jupiter.jpg                |
| `saturn.jpg`        | Saturn surface texture             | 2k_saturn.jpg                 |
| `saturn-ring.png`   | Saturn ring texture (with alpha)   | 2k_saturn_ring_alpha.png      |
| `uranus.jpg`        | Uranus surface texture             | 2k_uranus.jpg                 |
| `uranus-ring.png`   | Uranus ring texture (with alpha)   | Custom or procedural          |
| `neptune.jpg`       | Neptune surface texture            | 2k_neptune.jpg                |
| `pluto.jpg`         | Pluto surface texture              | 2k_pluto.jpg (from New Horizons data) |

### Alternative Source: NASA Visible Earth

Higher resolution textures from NASA (public domain):
https://visibleearth.nasa.gov/

### Alternative Source: JHT's Planetary Pixel Emporium

Additional high-quality textures:
http://planetpixelemporium.com/

## Notes

- All textures should be in JPEG format for diffuse maps (smaller file size)
- Ring textures should be PNG with alpha channel for transparency
- Normal maps should be in JPEG or PNG format
- Recommended resolution: 2048x1024 for a good balance of quality and performance
- The application will work without textures by using solid color fallbacks
