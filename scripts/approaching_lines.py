import matplotlib.pyplot as plt
import math



Ms=2
ms=1

k=0.04

xss = []
yss = []

mul=2
for i in range(0*mul,3*mul+1):
    xs = []
    ys = []
    #initial param
    I = i/mul
    y = I
    xs.append(0)
    ys.append(y)

    inside=False

    for t in range(1,100):
        if y > Ms:
            y = -k*t + I
        elif y < ms:
            y = k*t + I
        else:
            if not inside:
                c = (y - (Ms+ms)/2) / math.exp(2*k*(t-1)/(ms-Ms))
                inside=True
            y = c * math.exp(2*k*t/(ms-Ms)) + (Ms+ms)/2
        xs.append(t)
        ys.append(y)
    xss.append(xs)
    yss.append(ys)

plt.axhline(y = Ms, color = 'black', linestyle = '--', linewidth=2.5)
plt.axhline(y = ms, color = 'black', linestyle = '--', linewidth=2.5)

for i in reversed(range(len(xss))):
    xs=xss[i]
    ys=yss[i]
    plt.plot(xs,ys,'-', linewidth=1.9, label='$\mathregular{s_c}$(0)'+f'={round(ys[0], 2)}')

plt.legend(loc="upper right", fontsize="13")
plt.xlabel("Изминало време (дни)", fontdict={'size': 17})
plt.ylabel("Брой клетки $10^9$/L", fontdict={'size': 17})
plt.show()


# ---------------------------------------
# Euilers method sin(x)

#s = 0
#data = []
#ts = []
#
#delta = .01
#for i in range(15000):
#    s += delta * math.cos(i * delta)
#    s *= 1.0005
#    data.append(s)
#    ts.append(i * delta)
#
#plt.plot(ts, data)
#plt.show()



