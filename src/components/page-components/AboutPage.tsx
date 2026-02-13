import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { Header } from '../public-components';

interface PersonInfo {
  name: string;
  role: string;
  description: string;
}

const AUTHOR_INFO: PersonInfo = {
  name: '摄影师',
  role: '作者',
  description: '热爱摄影，专注于捕捉生活中的美好瞬间',
};

const SHARER_INFO: PersonInfo[] = [
  {
    name: 'OPPO',
    role: '共享者',
    description: '提供相机参数分享平台',
  },
  {
    name: '社区用户',
    role: '贡献者',
    description: '感谢所有参与参数分享的朋友们',
  },
];

export default function AboutPage() {
  return (
    <View style={styles.container}>
      <Header title="关于" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.appName}>相机大师</Text>
          <Text style={styles.description}>
            相机大师是一款专注于OPPO相机参数分享的应用。我们致力于为摄影爱好者提供一个交流和分享相机设置的平台，帮助更多人拍出精彩的照片。
          </Text>
          <Text style={styles.version}>版本 1.0.0</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>作者</Text>
          <View style={styles.personCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {AUTHOR_INFO.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>{AUTHOR_INFO.name}</Text>
              <Text style={styles.role}>{AUTHOR_INFO.role}</Text>
              <Text style={styles.personDescription}>
                {AUTHOR_INFO.description}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>感谢支持</Text>
          {SHARER_INFO.map((sharer, index) => (
            <View key={index} style={styles.personCard}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarTextSmall}>
                  {sharer.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>{sharer.name}</Text>
                <Text style={styles.role}>{sharer.role}</Text>
                <Text style={styles.personDescription}>
                  {sharer.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 相机大师. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  appName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: '#a3a3a3',
    fontSize: 16,
    lineHeight: 24,
  },
  version: {
    color: '#737373',
    fontSize: 14,
    marginTop: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#262626',
    marginVertical: 16,
  },
  personCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ff5111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  avatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff5111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextSmall: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  personInfo: {
    flex: 1,
    marginLeft: 16,
  },
  personName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  role: {
    color: '#ff5111',
    fontSize: 14,
    marginTop: 2,
  },
  personDescription: {
    color: '#a3a3a3',
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#737373',
    fontSize: 12,
  },
});