import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

import  CategoryButton  from '../../components/gestor/categoryButton';
import  FeedbackItem   from '../../components/gestor/feedbackItem';
import  BottomNavBar   from '../../components/gestor/BottomNavBar';

/* ─────────── imagens ─────────── */
const icons = {
  conteudos:    require('../../assets/book_6.png'),
  professores:  require('../../assets/co_present.png'),
  estrutura:    require('../../assets/domain.png'),
  add:          require('../../assets/add_2.png'),
};
const notificationIcon = require('../../assets/notifications.png');

const barChartIcon = require('../../assets/bar_chart.png');

/* ─────────── dados mock ─────────── */
const categories = [
  { id: '1', key: 'add'},
  { id: '2', key: 'estrutura',   label: 'Estrutura'},
  { id: '3', key: 'professores', label: 'Professores'},
  { id: '4', key: 'conteudos',   label: 'Conteúdos'},
];

const feedbackItems = [
  { id: '1', name: 'Camila Silva',   category: 'Conteúdos'   },
  { id: '2', name: 'Rogério Santos', category: 'Estrutura'   },
  { id: '3', name: 'Sandra Lima',    category: 'Professores' },
];

/* ─────────── componente ─────────── */
export default function HomeGestor() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* ─── Cabeçalho ─── */}
        <View style={{ marginBottom: 24 }}>
          {/* linha: saudação + sino */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#0f172a' }}>
              Olá, Rafael!
            </Text>

            {/* sino alinhado à direita */}
            <Image
              source={notificationIcon}
              style={{ width: 26, height: 26, marginLeft: 'auto' }}
              resizeMode="contain"
            />
          </View>

          {/* função / unidade */}
          <Text style={{ fontSize: 16, color: '#475569', marginBottom: 12 }}>
            Gestor – Fatec Praia Grande
          </Text>

          {/* cartão cinza de respostas */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F3F3F3',
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              maxWidth: 280,
            }}
          >
            <Image
              source={barChartIcon}
              style={{ width: 24, height: 24, marginRight: 10 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16, color: '#1e40af' }}>
              35 novas respostas{' '}
              <Text style={{ fontWeight: '500', color: '#6b7280' }}>
                esta semana
              </Text>
            </Text>
          </View>
        </View>

        {/* ─── Categorias ─── */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#334155',
              marginBottom: 12,
            }}
          >
            Questionários por categorias
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {categories.map(c => (
              <CategoryButton
                key={c.id}
                name={c.label}
                iconSource={icons[c.key]}
                onPress={() => console.log('Categoria:', c.label)}
              />
            ))}
          </View>
        </View>

        {/* ─── Últimos feedbacks ─── */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#334155' }}>
              Últimos feedbacks
            </Text>
            <Text style={{ fontSize: 14, color: '#2563eb' }}>Ver todos</Text>
          </View>

          <View
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingTop: 4,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {feedbackItems.map((item, idx) => (
              <FeedbackItem
                key={item.id}
                name={item.name}
                category={item.category}
                isLast={idx === feedbackItems.length - 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ─── Barra inferior ─── */}
      <BottomNavBar />
    </View>
  );
}
