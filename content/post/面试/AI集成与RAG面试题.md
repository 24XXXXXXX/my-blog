---
title: "AI 集成与 RAG 面试题"
description: "覆盖 LangChain4j、RAG、向量数据库、本地大模型部署与检索优化的面试题整理"
keywords: "面试,AI,RAG,LangChain4j,Ollama,向量数据库,Embedding"

date: 2026-04-20T10:18:00+08:00
lastmod: 2026-04-20T10:18:00+08:00

math: false
mermaid: false

categories:
  - 面试
tags:
  - AI
  - RAG
---
如果岗位涉及 AI 应用开发、知识库问答、企业智能助手，这一类问题会明显加分。这篇文章聚焦 LangChain4j、RAG 和本地大模型部署。
<!--more-->

## 一、基础概念

### 1. 什么是 LangChain4j？为什么要用它？

LangChain4j 是 Java 生态中用于集成大模型能力的开发框架。

价值：

- 统一接入不同模型
- 支持 Prompt、RAG、工具调用、Agent
- 降低 Java 项目接入 AI 的复杂度

### 2. 什么是 RAG？

RAG 是检索增强生成。

核心思路：

1. 先从知识库中检索相关内容
2. 再把检索结果拼接进 Prompt
3. 最后交给模型生成答案

### 3. 为什么需要 RAG，而不是直接问大模型？

- 大模型知识有时间边界
- 不知道企业私有数据
- 直接生成更容易幻觉

## 二、RAG 技术流程

### 1. RAG 的完整流程？

```text
文档加载 -> 清洗 -> 分块 -> 向量化 -> 存入向量库
用户提问 -> 问题向量化 -> 相似度检索 -> 拼接上下文 -> 大模型回答
```

### 2. 什么是向量数据库？

向量数据库用于存储和检索高维向量。

常见产品：

- Milvus
- Pinecone
- Chroma
- Weaviate
- Elasticsearch 向量检索

### 3. 文本分块策略有哪些？

- 固定大小分块
- 段落分块
- 句子分块
- 递归字符分块
- 语义分块

### 4. Embedding 模型是什么？

Embedding 模型负责把文本转成向量。

特点：

- 语义越接近，向量距离越近

### 5. 如何自建本地知识库？

1. 收集企业文档
2. 文档清洗
3. 文本分块
4. 生成向量
5. 存入向量库
6. 查询时相似度召回
7. 组装 Prompt 给模型回答

## 三、本地大模型部署

### 1. 如何本地部署大模型？

常见方式：

- Ollama
- vLLM
- llama.cpp

### 2. Ollama 是什么？如何使用？

Ollama 是本地大模型运行框架。

示例：

```bash
ollama run qwen2:7b
```

### 3. LangChain4j 如何对接本地大模型？

```java
ChatLanguageModel model = OllamaChatModel.builder()
    .baseUrl("http://localhost:11434")
    .modelName("qwen2:7b")
    .build();
```

### 4. 本地部署模型的硬件要求怎么回答？

建议答法：

- 模型规模越大，对显存和内存要求越高
- 量化后部署门槛会下降
- 具体取决于模型格式、上下文长度和推理框架

### 5. 什么是模型量化？

把高精度权重压缩为低精度格式，如：

- FP16 -> INT8
- FP16 -> INT4

作用：

- 降低部署成本
- 降低显存占用

## 四、LangChain4j 实现 RAG

### 1. 典型代码结构是什么？

```java
EmbeddingStore<TextSegment> embeddingStore = ...;
EmbeddingModel embeddingModel = ...;

ContentRetriever retriever = ContentRetriever.builder()
    .embeddingStore(embeddingStore)
    .embeddingModel(embeddingModel)
    .build();

Assistant assistant = AiServices.builder(Assistant.class)
    .chatLanguageModel(model)
    .contentRetriever(retriever)
    .build();
```

### 2. 如何提高 RAG 检索质量？

- 优化分块策略
- 使用更好的 Embedding 模型
- 混合检索
- 重排序
- 多路召回
- Query Rewrite

## 五、面试建议

如果公司明确做 AI 应用或知识库问答，建议重点准备：

1. RAG 全流程
2. 向量数据库与 Embedding
3. LangChain4j 的接入方式
4. 本地模型部署方案
5. 检索质量优化手段

这类题只背概念不够，最好能结合一个真实项目来讲。
