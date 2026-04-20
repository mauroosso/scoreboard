import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import { SERVER_URL } from '../config';
import { useControlPanel } from '../hooks/useControlPanel';
import { controlStyles as s, controlColors as C } from '../styles/controlStyles';
import type { MatchStatus } from '../types';

// ── Sub-componentes ─────────────────────────────────────────────────────────

const CardAccentBar: React.FC = () => (
  <LinearGradient
    colors={[C.accent, 'transparent']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={s.cardAccentBar}
  />
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <View style={s.sectionTitleRow}>
    <View style={s.sectionTitleIndicator} />
    <Text style={s.sectionTitleText}>{title}</Text>
  </View>
);

const Label: React.FC<{ text: string }> = ({ text }) => (
  <Text style={s.label}>{text}</Text>
);

interface BtnProps {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'primary' | 'danger';
}

const Btn: React.FC<BtnProps> = ({ title, onPress, variant = 'default' }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      s.btn,
      variant === 'primary' && s.btnPrimary,
      variant === 'danger' && s.btnDanger,
      pressed && s.btnPressed,
    ]}
  >
    <Text
      style={[
        s.btnText,
        variant === 'primary' && s.btnPrimaryText,
        variant === 'danger' && s.btnDangerText,
      ]}
    >
      {title}
    </Text>
  </Pressable>
);

// ── Componente principal ────────────────────────────────────────────────────

export function ControlScreen() {
  const ctl = useControlPanel();

  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootContent}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerIcon}>
          <Text style={s.headerIconText}>{'\u2699'}</Text>
        </View>
        <Text style={s.h1}>
          Control Scoreboard <Text style={s.h1Sub}>Panel de operador</Text>
        </Text>
      </View>

      {/* Equipos */}
      <View style={s.card}>
        <CardAccentBar />
        <SectionTitle title="EQUIPOS" />
        <View style={s.row}>
          <View style={s.flex1}>
            <Label text="LOCAL" />
            <TextInput style={s.input} value={ctl.homeTeam} onChangeText={ctl.setHomeTeam} />
          </View>
          <View style={s.flex1}>
            <Label text="VISITA" />
            <TextInput style={s.input} value={ctl.awayTeam} onChangeText={ctl.setAwayTeam} />
          </View>
        </View>
        <View style={s.row}>
          <View style={s.flex1}>
            <Label text="LOGO LOCAL URL" />
            <TextInput
              style={s.input}
              value={ctl.homeLogoUrl}
              onChangeText={ctl.setHomeLogoUrl}
              placeholder="https://..."
              placeholderTextColor={C.textMuted}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
          <View style={s.flex1}>
            <Label text="LOGO VISITA URL" />
            <TextInput
              style={s.input}
              value={ctl.awayLogoUrl}
              onChangeText={ctl.setAwayLogoUrl}
              placeholder="https://..."
              placeholderTextColor={C.textMuted}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        </View>
        <View style={s.btnSpacer}>
          <Btn
            title="Guardar equipos"
            variant="primary"
            onPress={() =>
              ctl.act({
                type: 'SET_TEAMS',
                homeTeam: ctl.homeTeam,
                awayTeam: ctl.awayTeam,
                homeLogoUrl: ctl.homeLogoUrl,
                awayLogoUrl: ctl.awayLogoUrl,
              })
            }
          />
        </View>
      </View>

      {/* Score */}
      <View style={s.card}>
        <CardAccentBar />
        <SectionTitle title="SCORE" />
        <View style={s.row}>
          <View style={s.flex1}>
            <Label text="SCORE LOCAL" />
            <TextInput
              style={s.input}
              value={ctl.homeScore}
              onChangeText={ctl.setHomeScore}
              keyboardType="numeric"
            />
          </View>
          <View style={s.flex1}>
            <Label text="SCORE VISITA" />
            <TextInput
              style={s.input}
              value={ctl.awayScore}
              onChangeText={ctl.setAwayScore}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={s.btnSpacer}>
          <Btn
            title="Setear score"
            variant="primary"
            onPress={() =>
              ctl.act({
                type: 'SET_SCORE',
                homeScore: Number(ctl.homeScore),
                awayScore: Number(ctl.awayScore),
              })
            }
          />
        </View>
        <View style={s.buttonsGrid}>
          <Btn title="+1 Local" onPress={() => ctl.act({ type: 'GOAL_HOME' })} />
          <Btn title="+1 Visita" onPress={() => ctl.act({ type: 'GOAL_AWAY' })} />
          <Btn title="-1 Local" onPress={() => ctl.act({ type: 'UNDO_GOAL_HOME' })} />
          <Btn title="-1 Visita" onPress={() => ctl.act({ type: 'UNDO_GOAL_AWAY' })} />
        </View>
      </View>

      {/* Reloj */}
      <View style={s.card}>
        <CardAccentBar />
        <SectionTitle title="RELOJ" />
        <View style={s.row}>
          <View style={s.flex1}>
            <Label text="MINUTOS" />
            <TextInput style={s.input} value={ctl.minutes} onChangeText={ctl.setMinutes} keyboardType="numeric" />
          </View>
          <View style={s.flex1}>
            <Label text="SEGUNDOS" />
            <TextInput style={s.input} value={ctl.seconds} onChangeText={ctl.setSeconds} keyboardType="numeric" />
          </View>
          <View style={s.flex1}>
            <Label text="PERIODO" />
            <TextInput style={s.input} value={ctl.period} onChangeText={ctl.setPeriod} keyboardType="numeric" />
          </View>
        </View>
        <View style={s.row}>
          <View style={s.flex1}>
            <Label text="ESTADO" />
            <View style={s.pickerWrapper}>
              <Picker
                selectedValue={ctl.status}
                onValueChange={(v) => ctl.setStatus(v as MatchStatus)}
                style={s.picker}
                dropdownIconColor={C.textMuted}
              >
                <Picker.Item label="PRE" value="PRE" />
                <Picker.Item label="LIVE" value="LIVE" />
                <Picker.Item label="PAUSED" value="PAUSED" />
                <Picker.Item label="BREAK" value="BREAK" />
                <Picker.Item label="ENDED" value="ENDED" />
              </Picker>
            </View>
          </View>
          <View style={s.flex1}>
            <Label text="DURACION PERIODO (MIN)" />
            <TextInput style={s.input} value={ctl.periodDuration} onChangeText={ctl.setPeriodDuration} keyboardType="numeric" />
          </View>
        </View>
        <View style={s.btnSpacer}>
          <Btn
            title="Setear reloj"
            variant="primary"
            onPress={async () => {
              const elapsedMs = (Number(ctl.minutes) * 60 + Number(ctl.seconds)) * 1000;
              const periodDurationMs = Number(ctl.periodDuration) * 60 * 1000;
              await ctl.act({ type: 'SET_CLOCK_MS', elapsedMs });
              await ctl.act({ type: 'SET_PERIOD', period: Number(ctl.period) });
              await ctl.act({ type: 'SET_STATUS', status: ctl.status });
              await ctl.act({ type: 'SET_PERIOD_DURATION_MS', periodDurationMs });
            }}
          />
        </View>
        <View style={s.buttonsGrid}>
          <Btn title="Iniciar" onPress={() => ctl.act({ type: 'START_CLOCK' })} />
          <Btn title="Pausar" onPress={() => ctl.act({ type: 'PAUSE_CLOCK' })} />
          <Btn title="Reset reloj" onPress={() => ctl.act({ type: 'RESET_CLOCK' })} />
          <Btn title="Sig. periodo" onPress={() => ctl.act({ type: 'NEXT_PERIOD' })} />
        </View>
      </View>

      {/* Estado actual */}
      <View style={s.card}>
        <CardAccentBar />
        <SectionTitle title="ESTADO ACTUAL" />
        <ScrollView style={s.statePre} nestedScrollEnabled>
          <Text style={s.statePreText}>{ctl.stateJson}</Text>
        </ScrollView>
        <View style={s.buttonsGrid}>
          <Btn title="Refrescar" onPress={ctl.loadState} />
          <Btn title="Reset match" variant="danger" onPress={() => ctl.act({ type: 'RESET_MATCH' })} />
          <Btn title="Abrir pantalla" onPress={() => Linking.openURL(`${SERVER_URL}/`)} />
          <Btn title="Fullscreen" onPress={() => Alert.alert('Info', 'Fullscreen no disponible en RN')} />
        </View>
      </View>
    </ScrollView>
  );
}
