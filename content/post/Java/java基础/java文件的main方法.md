---
title: "Java文件的main方法"
description: "java文件的main方法"
keywords: "java文件的main方法"

date: 2026-01-31T12:46:35+08:00
lastmod: 2026-01-31T12:46:35+08:00

math: false
mermaid: false

categories:
  -
tags:
  -
  -
---
对于一个普通的`java`代码文件，要让他运行怎么写需要像`c`那样有一个`main`函数最为程序的入口吗，比如`两数之和.java`?
#### 是的，在 Java 中，要让一个普通的代码文件运行，必须有一个 main 方法作为程序入口，类似于 C 语言的 main 函数。
<!--more-->
1. 基本规则
main 方法必须严格按以下格式定义：

JAVA
public static void main(String[] args) {
    // 程序入口代码
}
public：JVM 需要能访问该方法。
static：不依赖对象实例，直接由 JVM 调用。
void：不返回任何值。
String[] args：命令行参数（可选）。
文件名必须和 public class 名称一致（如 TwoSum.java 必须包含 public class TwoSum）。

2. 示例：两数之和（可运行版本）
（1）完整代码（TwoSum.java）
JAVA
public class TwoSum {
    // main 方法：程序入口
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("结果: [" + result[0] + ", " + result[1] + "]");
    }

    // 两数之和算法
    public static int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[0]; // 无解时返回空数组
    }
}
（2）运行步骤
保存文件 → TwoSum.java
编译（生成 .class 文件）：
BASH
javac TwoSum.java
运行：
BASH
java TwoSum
输出：
TEXT
结果: [0, 1]
3. 对比 C 语言的 main 函数
特性	C 语言	Java
入口函数	int main(int argc, char *argv[])	public static void main(String[] args)
返回值	int（通常返回 0 表示成功）	void（无返回值）
命令行参数	char *argv[]	String[] args
文件命名	任意（如 sum.c）	必须和 public class 同名（如 TwoSum.java）
4. 常见问题
（1）如果没有 main 方法，能运行吗？
不能！ 运行时会报错：
TEXT
错误: 在类 TwoSum 中找不到 main 方法
（2）一个 .java 文件可以有多个 main 方法吗？
可以，但只有 public class 的 main 方法 会被执行。
示例：
JAVA
class Helper {
    public static void main(String[] args) {
        System.out.println("Helper 的 main");
    }
}

public class TwoSum {
    public static void main(String[] args) {
        System.out.println("TwoSum 的 main");
    }
}
执行 java TwoSum → 输出 TwoSum 的 main
执行 java Helper → 输出 Helper 的 main（需编译后单独运行）
（3）main 方法可以重载吗？
可以，但只有 public static void main(String[]) 会被 JVM 调用。
JAVA
public class MainExample {
    // 标准入口
    public static void main(String[] args) {
        System.out.println("Hello World");
    }

    // 重载版本（不会被自动调用）
    public static void main(int num) {
        System.out.println("数字: " + num);
    }
}
5. 总结
Java 必须要有 main 方法 才能运行，格式必须正确。
文件名必须和 public class 同名（如 TwoSum.java → public class TwoSum）。
编译用 javac，运行用 java。
对比 C 语言，Java 的 main 方法没有返回值，且参数是 String[] 而不是 char**。
如果只是写工具类（无 main），可以编译但不能直接运行，需被其他类调用。

