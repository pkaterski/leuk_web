import csv
import matplotlib.pyplot as plt
from pylab import rcParams

with open(f'out/test.csv', newline='') as csvfile:
    lines = csv.reader(csvfile, delimiter=',')

    wbc_total = []
    itter = next(lines)
    for point in itter:
        wbc_total.append(float(point))
    
    wbc = []
    itter = next(lines)
    for point in itter:
        wbc.append(float(point))

    ss = []
    itter = next(lines)
    for point in itter:
        ss.append(float(point))

    al = []
    itter = next(lines)
    for point in itter:
        al.append(float(point))
    
    nl = []
    itter = next(lines)
    for point in itter:
        nl.append(float(point))

ts = [i/1000 for i in range(len(wbc))]

figure, axis = plt.subplots(2, 3)

axis[0, 0].plot(ts, wbc_total)
axis[0, 0].set_title("wbc_total")

axis[0, 1].plot(ts, wbc)
axis[0, 1].set_title("wbc")

axis[1, 0].plot(ts, ss)
axis[1, 0].set_title("ss")

axis[1, 1].plot(ts, al)
axis[1, 1].set_title("al")

axis[0, 2].plot(ts, nl)
axis[0, 2].set_title("nl")

plt.show()