#!/usr/bin/env python3
import math

# Nominal inputs (from eclipse.md)
R_eq = 6378.137
D_m = 3474.2
d_m = 359797.0
W_u = 197.5
L1 = 0.53583

# Derived
def compute(D_m, d_m, R_eq, W_u, L1):
    W_p_eff = 2.0 * L1 * R_eq  # km
    L_m = d_m - R_eq
    # Guard against division by zero
    denom = (W_p_eff + W_u - 2.0 * D_m)
    if abs(denom) < 1e-9:
        D_s = float('nan')
    else:
        D_s = D_m * (W_p_eff - W_u) / denom
    # x (Sun center -> Moon center)
    denom2 = (D_m - W_u)
    if abs(denom2) < 1e-9:
        x = float('nan')
    else:
        x = L_m * (D_s - D_m) / denom2
    d_s = x + d_m
    # angular diameter at Earth's surface
    obs_dist = d_s - R_eq
    theta_deg = None
    if obs_dist>0:
        theta_rad = 2.0 * math.atan((D_s) / (2.0 * obs_dist))
        theta_deg = math.degrees(theta_rad)
    return {
        'W_p_eff': W_p_eff,
        'D_s': D_s,
        'x': x,
        'd_s': d_s,
        'theta_deg': theta_deg
    }

nom = compute(D_m, d_m, R_eq, W_u, L1)
print('Nominal inputs:')
print(f'  R_eq={R_eq} km, D_m={D_m} km, d_m={d_m} km, W_u={W_u} km, L1={L1} Earth-radii')
print('Nominal outputs:')
for k,v in nom.items():
    if v is None:
        print(f'  {k}: None')
    elif isinstance(v, float):
        print(f'  {k}: {v:.6g}')
    else:
        print(f'  {k}: {v}')
print('\nSensitivity tests:')

# Variation sets
L1_factors = [0.995, 0.999, 1.0, 1.001, 1.005]  # -0.5%, -0.1%, +0.1%, +0.5%
W_u_vals = [W_u-5.0, W_u-1.0, W_u, W_u+1.0, W_u+5.0]
D_m_vals = [D_m-5.0, D_m-1.0, D_m, D_m+1.0, D_m+5.0]

print('\nVarying L1 (others nominal):')
print(' L1_factor | W_p_eff (km) | D_s (km) | d_s (km) | theta (deg) | %Δ D_s')
for f in L1_factors:
    res = compute(D_m, d_m, R_eq, W_u, L1 * f)
    pct = (res['D_s'] - nom['D_s'])/nom['D_s']*100.0 if nom['D_s'] else float('nan')
    print(f' {f:8.4f} | {res["W_p_eff"]:11.3f} | {res["D_s"]:9.3f} | {res["d_s"]:9.3f} | {res["theta_deg"]:8.4f} | {pct:8.4f}%')

print('\nVarying W_u (others nominal):')
print(' W_u (km) | D_s (km) | d_s (km) | theta (deg) | %Δ D_s')
for w in W_u_vals:
    res = compute(D_m, d_m, R_eq, w, L1)
    pct = (res['D_s'] - nom['D_s'])/nom['D_s']*100.0
    print(f' {w:8.3f} | {res["D_s"]:9.3f} | {res["d_s"]:9.3f} | {res["theta_deg"]:8.4f} | {pct:8.4f}%')

print('\nVarying D_m (others nominal):')
print(' D_m (km) | D_s (km) | d_s (km) | theta (deg) | %Δ D_s')
for dm in D_m_vals:
    res = compute(dm, d_m, R_eq, W_u, L1)
    pct = (res['D_s'] - nom['D_s'])/nom['D_s']*100.0
    print(f' {dm:8.3f} | {res["D_s"]:9.3f} | {res["d_s"]:9.3f} | {res["theta_deg"]:8.4f} | {pct:8.4f}%')

# Cross-sensitivity example: increase L1 by +0.5% and W_u by +1 km
res = compute(D_m, d_m, R_eq, W_u+1.0, L1*1.005)
print('\nCross-sensitivity (L1*1.005, W_u+1 km):')
print(f" D_s={res['D_s']:.3f} km, d_s={res['d_s']:.3f} km, theta={res['theta_deg']:.4f} deg")
