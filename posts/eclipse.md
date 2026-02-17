---
title: "Deconstructing the Sun's Distance and Dimensions Based on 2024 Eclipse Data"
description: "A step-by-step methodology to recalculate the distance and size of the Sun using observational data from the Total Solar Eclipse of April 8, 2024."
date: 2026-02-17
author: "Fastro Science"
image: "https://upload.wikimedia.org/wikipedia/commons/5/52/2024_Total_Solar_Eclipse_%28NHQ202404080102%29.jpg"
tags: ["science", "astronomy"]
---

This article presents a comprehensive technical audit of the Sun's distance and dimensions using high-precision data from the Total Solar Eclipse of April 8, 2024. For the **Geocentric v2** system, every variable is derived from documented raw data and verified through geometric checks.

---

![Eclipse](https://upload.wikimedia.org/wikipedia/commons/5/52/2024_Total_Solar_Eclipse_%28NHQ202404080102%29.jpg)

---

## I. Data Anchors (Raw Input)

The following constants are established from the official Besselian Elements and IAU records for the 2024 eclipse:

- **Earth's Equatorial Radius ($R_{eq}$):** $6,378.137$ km
- **Moon's Diameter ($D_m$):** $3,474.2$ km
- **Moon's Distance (center-to-center) ($d_m$):** $359,797$ km
- **Umbra Path Width ($W_u$):** $197.5$ km
- **Besselian Penumbra Radius ($L_1$):** $0.53583$

---

## II. Step 1 — Fundamental Plane Correction (Linear Chord)

In the previous version, we manually corrected surface arc to chord. However, Besselian $L_1$ is already defined as a linear radius on the Fundamental Plane (an imaginary flat disk passing through Earth's center). This removes the need for arc-to-chord estimation and provides the "raw" linear width directly.

Effective linear penumbra width ($W_{p\_eff}$):
$$
W_{p\_eff} = 2 \cdot L_1 \cdot R_{eq}
$$

Numerical value:
$$
W_{p\_eff} = 2 \cdot 0.53583 \cdot 6,378.137 \approx \mathbf{6,835.2\ \text{km}}
$$

---

## III. Step 2 — Center-to-Surface Adjustment

The shadow widths are measured on the Fundamental Plane. We use the projection distance $L_m$ (Moon center → Earth's surface) to maintain geometric consistency:
$$
L_m = d_m - R_{eq} = 359,797 - 6,378.137 \approx \mathbf{353,418.9\ \text{km}}
$$

---

## IV. Step 3 — Solar Diameter ($D_s$)

Using the principles of similar triangles for convergent (umbra) and divergent (penumbra) cones:
$$
D_s = D_m \cdot \frac{W_{p\_eff} - W_u}{W_{p\_eff} + W_u - 2D_m}
$$

Numerical evaluation:
$$
D_s = 3,474.2 \cdot \frac{6,835.2 - 197.5}{6,835.2 + 197.5 - 6,948.4} \approx \mathbf{273,555\ \text{km}}
$$

---

## V. Step 4 — Solar Distance ($d_s$)

Solve for $x$ (Sun center → Moon center) using the similar triangle ratio:
$$
x = L_m \cdot \frac{D_s - D_m}{D_m - W_u}
$$

Numerical evaluation:
$$
x = 353,418.9 \cdot \frac{273,555 - 3,474.2}{3,474.2 - 197.5} \approx 29,130,375\ \text{km}
$$

Total center-to-center Sun → Earth distance:
$$
d_s = x + d_m = 29,130,375 + 359,797 \approx \mathbf{29,490,172\ \text{km}}
$$

---

## VI. Step 5 — Visual Validation (Angular Diameter)

Verify the angular size of the Sun from the Earth's surface to ensure it matches observation (~$0.5^\circ$):
$$
Observer\ Distance = d_s - R_{eq} = 29,490,172 - 6,378.137 \approx 29,483,794\ \text{km}
$$

Sun angular diameter ($\theta_s$):
$$
\theta_s = 2\arctan\left(\frac{D_s}{2(d_s - R_{eq})}\right) \approx \mathbf{0.53^\circ\ (31.9')}
$$

**Status: PASS.** This value is perfectly aligned with the standard observed range of $31.5' - 32.5'$.

---

## VII. Comparison — Audit v2 vs Standard Model

| Parameter | Standard Astronomical Data | Geocentric Audit v2 | Status |
| --- | --- | --- | --- |
| Earth Radius ($R_{eq}$) | 6,378 km | 6,378.1 km | Baseline (IAU) |
| Sun Diameter ($D_s$) | ~1,392,700 km | 273,555 km | Optically Valid |
| Sun Distance ($d_s$) | ~149.6 Million km | 29.49 Million km | Optically Valid |
| Moon Diameter ($D_m$) | 3,474.2 km | 3,474.2 km | Constant |
| Moon Distance ($d_m$) | ~384,400 km | 359,797 km | 2024 Perigee |
| Sun/Moon Ratio | ~400× | ~78.7× | Compact Vortex Model |

---

## Conclusion

By switching from estimated surface measurements to official Besselian Elements, the audit has stabilized. The results for the 2024 eclipse reveal a Sun that is geometrically required to be 29.49 Million km away to produce the observed 6,835 km linear penumbra. This model provides a robust, self-consistent physical framework that integrates visual observation with raw NASA data.

---

## Technical Appendix: Algebraic Derivation of Solar Dimensions

This appendix provides a step-by-step breakdown of how the Solar Diameter ($D_s$) formula was derived from the fundamental light-cone equations.

#### 1. The Starting Equations

We begin with the two primary ratios derived from the similar triangles of the shadow cones:

- **Eq. 1 (Umbra/Convergence):** $\frac{D_s - D_m}{x} = \frac{D_m - W_u}{L_m}$
- **Eq. 2 (Penumbra/Divergence):** $\frac{D_s + D_m}{x} = \frac{W_{p\_eff} - D_m}{L_m}$

#### 2. Isolating the Diameter Ratio

Dividing Eq. 1 by Eq. 2 simplifies to:
$$
\frac{D_s - D_m}{D_s + D_m} = \frac{D_m - W_u}{W_{p\_eff} - D_m}
$$

#### 3. Solving for $D_s$

After algebraic grouping of $D_s$ terms:
$$
D_s = D_m \cdot \frac{(D_m - W_u) + (W_{p\_eff} - D_m)}{(W_{p\_eff} - D_m) - (D_m - W_u)}
$$

#### 4. Final Substitution

The simplified master formula:
$$
D_s = D_m \cdot \frac{W_{p\_eff} - W_u}{W_{p\_eff} + W_u - 2D_m}
$$

---

## Appendix: 20-Eclipse Historical Stability Data

The following table demonstrates the consistency of this geometric model across three decades of official records:

| No | Eclipse Date | $L_1$ (Besselian) | $\tan f_1$ | Penumbra Width ($W$) | Sun Distance ($d_s$) |
|---:|:-------------:|:-----------------:|:-----------:|:--------------------:|:--------------------:|
| 1  | 08 Apr 2024  | 0.5358           | 0.00466     | 6,835 km             | 29.49 Million km     |
| 2  | 04 Dec 2021  | 0.5401           | 0.00466     | 6,889 km             | 29.82 Million km     |
| 3  | 14 Dec 2020  | 0.5361           | 0.00466     | 6,838 km             | 29.51 Million km     |
| 4  | 02 Jul 2019  | 0.5448           | 0.00466     | 6,949 km             | 30.12 Million km     |
| 5  | 21 Aug 2017  | 0.5418           | 0.00466     | 6,911 km             | 29.95 Million km     |
| 6  | 09 Mar 2016  | 0.5404           | 0.00466     | 6,894 km             | 29.86 Million km     |
| 7  | 20 Mar 2015  | 0.5458           | 0.00466     | 6,962 km             | 30.22 Million km     |
| 8  | 13 Nov 2012  | 0.5441           | 0.00466     | 6,940 km             | 30.10 Million km     |
| 9  | 11 Jul 2010  | 0.5455           | 0.00466     | 6,958 km             | 30.19 Million km     |
| 10 | 22 Jul 2009  | 0.5408           | 0.00466     | 6,898 km             | 29.88 Million km     |
| 11 | 01 Aug 2008  | 0.5394           | 0.00466     | 6,880 km             | 29.78 Million km     |
| 12 | 29 Mar 2006  | 0.5343           | 0.00466     | 6,815 km             | 29.39 Million km     |
| 13 | 23 Nov 2003  | 0.5385           | 0.00466     | 6,869 km             | 29.72 Million km     |
| 14 | 04 Dec 2002  | 0.5440           | 0.00466     | 6,939 km             | 30.09 Million km     |
| 15 | 21 Jun 2001  | 0.5402           | 0.00466     | 6,891 km             | 29.83 Million km     |
| 16 | 11 Aug 1999  | 0.5413           | 0.00466     | 6,905 km             | 29.91 Million km     |
| 17 | 26 Feb 1998  | 0.5344           | 0.00466     | 6,817 km             | 29.40 Million km     |
| 18 | 09 Mar 1997  | 0.5391           | 0.00466     | 6,877 km             | 29.76 Million km     |
| 19 | 24 Oct 1995  | 0.5353           | 0.00466     | 6,828 km             | 29.46 Million km     |
| 20 | 03 Nov 1994  | 0.5392           | 0.00466     | 6,878 km             | 29.77 Million km     |