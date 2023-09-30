import csv
import matplotlib.pyplot as plt
from pylab import rcParams
import sys

FILE_NAME = sys.argv[1]

with open(f'/Users/pkaterski/Desktop/leuk_data/conv_just_nums/{FILE_NAME}', newline='') as csvfile:
    lines = csv.reader(csvfile, delimiter=',')

    # points 
    data_points_x1 = []
    data_points_y1 = []
    itter1 = next(lines)
    for i,point in enumerate(itter1):
        if len(point) == 0:
            continue
        data_points_x1.append(i + 1)
        data_points_y1.append(float(point))

    # Alexan application 
    data_alexan_x1 = []
    data_alexan_y1 = []
    itter1 = next(lines)
    for i,point in enumerate(itter1):
        if len(point) == 0:
            continue
        data_alexan_x1.append(i + 1)
        data_alexan_y1.append(point)

with open(f'out/test1.csv', newline='') as csvfile:
    lines = csv.reader(csvfile, delimiter=',')

    # points 
    data_points_x2 = []
    data_points_y2 = []

    # time
    itter2 = next(lines)
    for point in itter2:
        data_points_x2.append(float(point))

    # vals
    itter2 = next(lines)
    for point in itter2:
        data_points_y2.append(float(point))

    # Alexan application 
    data_alexan_x2 = []
    data_alexan_y2 = []
    itter2 = next(lines)

    for i,point in enumerate(itter2):
        if len(point) == 0:
            continue
        data_alexan_x2.append(data_points_x2[i])
        data_alexan_y2.append(point)

rcParams['figure.figsize'] = 12, 5
plt.xticks(range(1, len(itter1) + 1))

if not all([i-0 in data_alexan_x1 for i in data_alexan_x2]):
    print("WARNING: ALEXAN MISMATCH")

# for x_l in data_alexan_x2:
#     plt.axvline(x_l, color='darkred')
for x_l in data_alexan_x1:
    plt.axvline(x_l, color='pink', linestyle="--")

filtered_data_points_x = []
filtered_data_points_y = []

for i,point in enumerate(data_points_x2):
    if point in data_points_x1:
        filtered_data_points_x.append(data_points_x2[i])
        filtered_data_points_y.append(data_points_y2[i])

plt.plot(data_points_x1, data_points_y1, 'go-')
plt.plot(data_points_x2, data_points_y2, '-', color='0.8')
plt.plot(filtered_data_points_x, filtered_data_points_y, 'bo-')

#plt.plot(data_alexan_x1, data_alexan_y1, 'o')

# plt.show()
plt.savefig(f'out/a{FILE_NAME}.png', dpi=199)
plt.close()


